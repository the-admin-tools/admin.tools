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
	ReadBufferSize:  1,
	WriteBufferSize: 1                         ,
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
	conn *websocket.Conn
	read chan []byte
	write chan []byte
	writeErr chan []byte
}

func (ws *Ws) readInit() {
	defer func() {
		ws.conn.Close()
	}()
	for {
		_, message, err := ws.conn.ReadMessage()
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.Printf("error: %v", err)
			}
			break
		}
		fmt.Printf("Received message: %c\n", message)
		ws.read <- message
	}
}

func (ws *Ws) writeInit() {
	for {
		select {
		case message, ok := <- ws.write:
			if !ok {
				// The hub closed the channel.
				ws.conn.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}

			w, err := ws.conn.NextWriter(websocket.TextMessage)
			if err != nil {
				return
			}
			fmt.Printf("Received message writeInit: %c\n", message)
			w.Write(message)
			if err := w.Close(); err != nil {
				return
			}
		}
	}
}


func main() { 
	
	flag.Parse()
	upgrader.CheckOrigin = func(_ *http.Request) bool {
		return true
	}

	http.HandleFunc("/", defaultHandleFunc)
	http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		conn, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			log.Println(err)
			return
		}

		ws := &Ws{conn: conn, read: make(chan []byte), write: make(chan []byte), writeErr: make(chan []byte)}
		go sshInit(ws)
		go ws.readInit()
		go ws.writeInit()
	})
	err := http.ListenAndServe(*addr, nil)
	if err != nil {
		log.Fatal("ListenAndServe: ", err)
	}
}