package main

import (
	"github.com/kr/pty"
	"io"
	"os"
	"os/exec"
	
)

func main() {
	c := exec.Command("grep", "--color=auto", "bar")
	f, err := pty.Start(c)
	if err != nil {
		fmt.Println("hello, world")
		panic(err)
	}

	// Set the size of the pty
	pty.Setsize(f, 20, 40)


	go func() {
		f.Write([]byte("foo\n"))
		f.Write([]byte("bar\n"))
		f.Write([]byte("baz\n"))
		f.Write([]byte{4}) // EOT
	}()
	io.Copy(os.Stdout, f)
}