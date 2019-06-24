package main

import (
        "code.google.com/p/go.net/websocket"
        "crypto/tls"
        "fmt"
        "log"
)

var origin = "http://localhost.localdomain/"
var url = "wss://localhost.localdomain:443/echo"

func main() {
        config,_ := websocket.NewConfig(url, origin)
        config.TlsConfig = &tls.Config{
                    InsecureSkipVerify: true,
                    ServerName:         "localhost.localdomain",
                }
        ws, err := websocket.DialConfig(config)
        // ws, err := websocket.Dial(url, "", origin)
        if err != nil {
                log.Fatal(err)
        }
        message := []byte("hello, world!")
        _, err = ws.Write(message)
        if err != nil {
                log.Fatal(err)
        }
        fmt.Printf("Send: %s\n", message)
        var msg = make([]byte, 512)
        _, err = ws.Read(msg)
        if err != nil {
                log.Fatal(err)
        }
        fmt.Printf("Receive: %s\n", msg)
}