---
title: Goの非同期処理を理解する
date: 2025-08-29
tags:
  - go
  - programming
---

最近Goを勉強し始めました

ちょっと勉強したので残します

JSのpromiseとは全然違って単純明解、分かりやすい



## 1. sync.WaitGroup

```go
package main

import (
	"fmt"
	"sync"
)

func main() {
	var wg sync.WaitGroup

	for i := 0; i < 5; i++ {
		wg.Add(1)
		go func(id int) {
			defer wg.Done()
			fmt.Println("goroutine:", id)
		}(i)
	}

	wg.Wait()
}
```

```
goroutine: 4
goroutine: 0
goroutine: 1
goroutine: 3
goroutine: 2
```

`sync.WaitGroup`はgoroutineが終わらないように管理するもの

持つメソッドは`Add()`, `Done()`, `Wait()`の3種類のみ

`go func()`でgoroutineスタートされてmain関数はおそらく最初に`wg.Wait()`に到着する

`wg.Add(1)`でカウンターが1になり、goroutineが終わるときに`wg.Done()`される

カウンターが0になったと同時に`wg.Wait()`が解除されて終了

当たり前だけど非同期なので順番は保証されない


## 2. unbuffered channel

```go
package main

import "fmt"

func main() {
	ch := make(chan int)

	go func() {
		ch <- 42
	}()

	v := <-ch
	fmt.Println(v)
}
```

```
42
```

1. `make`でint型のチャネルを作成
2. goroutine内でchに42を送信
3. ほぼ同時にmain関数内で<-chに到着
4. 2, 3が同時にやり取りを完了する、それまではブロック状態

これはバッファーが無い状態で42を送信しようとするため、受信側が不在だとブロックされる



## 3. bufferd channel

```go
package main

import "fmt"

func main() {
	ch := make(chan int, 3)

	ch <- 1
	ch <- 2
	ch <- 3

	close(ch)

	for v := range ch {
		fmt.Println(v)
	}
}
```

```
1
2
3
```

今度はさっきと違ってバッファを3設けている。バッファはFIFOが保証される

そのため ch <- 1,2,3 が可能になりunbufferedと比べてわかる通り、基本的にバッファがなくなったときにブロックされる

close()を呼ぶことで送信しないことを明言する

バッファにデータが残っている場合はそのまま取り出すことが可能、空になった後は0が返り続ける

空判定は `v, ok := <- ch` で可能。okがtrue奈良データを受け取った、falseならcloseされている且つバッファも空という意味になる

`range ch` が便利でokがfalseになったかどうかを確認して自動でループを抜ける = close()を呼ばないとずっと待ち続ける⚠️⚠️⚠️⚠️



## 4. select

```go
package main

import (
	"fmt"
	"time"
)

func main() {
	ch1 := make(chan string)
	ch2 := make(chan string)

	go func() {
		time.Sleep(1 * time.Second)
		ch1 <- "from ch1"
	}()

	go func() {
		time.Sleep(2 * time.Second)
		ch2 <- "from ch2"
	}()

	for i := 0; i < 2; i++ {
		select {
		case msg1 := <-ch1:
			fmt.Println(msg1)
		case msg2 := <-ch2:
			fmt.Println(msg2)
		}
	}
}
```

```
from ch1
from ch2
```

goroutineが2つ起動、1秒後にch1に文字列`from ch1`が、2秒後にch2に文字列`from ch2`が送信される

selectはチャネルを受信するための分岐で、この場合ch1, ch2のどちらかが受信するまで待機する

最初にch1から受信するので`case msg1`が実行され、goroutineの`from ch1`が表示

forによって繰り返されるので再びselect, ch2から受信される


## 5. worker

```go
package main

import (
	"fmt"
	"sync"
)

func worker(id int, jobs <-chan int, results chan<- int, wg *sync.WaitGroup) {
	defer wg.Done()
	for j := range jobs {
		results <- j * j
	}
	_ = id
}

func main() {
	jobs := make(chan int, 10)
	results := make(chan int, 10)
	var wg sync.WaitGroup

	for w := 1; w <= 3; w++ {
		wg.Add(1)
		go worker(w, jobs, results, &wg)
	}

	for j := 1; j <= 5; j++ {
		jobs <- j
	}
	close(jobs)

	wg.Wait()
	close(results)

	for r := range results {
		fmt.Println(r)
	}
}
```

```
9
16
25
1
4
```

1. バッファ10のチャネルjobs, resultsを定義、一緒にWaitGroupも作成
2. workerをgoroutineとして3つ作成
3. jobsに1~5を送信、バッファは足りているのでブロックは起きない
4. close()で送信終了
5. workerはid, jobs受信チャネル, results送信チャネル, WaitGroupを受け取る
   1. `range jobs`でチャネルが送信されたらworker3つで取り合う
   2. 2乗して　resultsに送信, バッファ10なのでブロック無し
   3. `wg.Done()`で終了させる
6. wg.Wait()で待機、この時点でworkerが終了していることが保証されるのでresultsの送信終了が可能
7. resultsで受け取る


## 6. cancel

```go
package main

import (
	"context"
	"fmt"
	"time"
)

func main() {
	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
	defer cancel()

	go func() {
		for {
			select {
			case <-ctx.Done():
				fmt.Println("cancelled: ", ctx.Err())
				return
			default:
				time.Sleep(500 * time.Millisecond)
				fmt.Println("working...")
			}
		}
	}()

	time.Sleep(3 * time.Second)
}
```

```
working...
working...
working...
working...
cancelled: context deadline exceeded
```

goroutineの外部から終了したことを知らせるcancel

`context.WithTimeout()`は相対時間で`ctx.Done()`に`chan struct{}`を渡す。からの構造体で、シグナルを送るためだけの型といえる

`select`の`default`はどのcaseにも当てはまらなかったときに呼ばれる。500millisecond待った後にselectを抜けて、forで無限にループする。

2秒後には`ctx.Done()`にシグナルが入るので、selectによってcaseにかかり、そのままreturnでgoroutineが終了する

1. 0.5秒間隔でworking...
2. 2秒後にcancelled: 
3. time.Sleepによって3秒ブロックされる



