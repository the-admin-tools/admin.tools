package main

import (
	"flag"
	"log"
	"net/http"
	"fmt"

	"github.com/gorilla/websocket"
)

var addr = flag.String("addr", ":16443", "admin.tools server")
var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

func defaultHandleFunc(w http.ResponseWriter, r *http.Request) {
	log.Println(r.URL)
	// Throw not found for every unsupported request
	if r.URL.Path != "/" || r.Method != "GET" {
		http.Error(w, "Not found", http.StatusNotFound)
		return
	}
}

type Ws struct {

}



func main() {
	
	flag.Parse()
	
	http.HandleFunc("/", defaultHandleFunc)
	http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		conn, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			log.Println(err)
			return
		}

		client := &Client{hub: hub, conn: conn, send: make(chan []byte, 256)}
		client.hub.register <- client

		// Allow collection of memory referenced by the caller by doing all work in
		// new goroutines.
		go client.writePump()
		go client.readPump()
		fmt.Fprintf(w, "hello, world")
		fmt.Println(r.Body)
	})
	err := http.ListenAndServe(*addr, nil)
	if err != nil {
		log.Fatal("ListenAndServe: ", err)
	}
}