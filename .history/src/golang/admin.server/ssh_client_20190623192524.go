package main

import (
	"fmt"
	"golang.org/x/crypto/ssh"
	"log"
	"os"
	// Uncomment to store output in variable
	//"bytes"
)

type SSHClient struct {
	Config *ssh.ClientConfig
	Host   string
	Port   int
}

type keyboardInteractive map[string]string

func (cr keyboardInteractive) Challenge(user string, instruction string, questions []string, echos []bool) ([]string, error) {
	var answers []string
	for _, q := range questions {
		answers = append(answers, cr[q])
	}
	return answers, nil
}

func main() {
 
	answers := keyboardInteractive(map[string]string{
		"Verification code: ": "12345678",
	})

	sshConfig := &ssh.ClientConfig{
		User: "admin",
		Auth: []ssh.AuthMethod{
			ssh.KeyboardInteractive(answers.Challenge),
		},
		HostKeyCallback: ssh.InsecureIgnoreHostKey(),
	}
 
	client := &SSHClient{
		Config: sshConfig,
		Host:   "localhost",
		Port:   9038,
	}

	// Connect to host
	connection, err := ssh.Dial("tcp", fmt.Sprintf("%s:%d", client.Host, client.Port), client.Config)
	if err != nil {
		// return nil, fmt.Errorf("Failed to connect to the requested server: %s", err)
		fmt.Println("Failed to connect to the requested server: %s", err)
	}
	defer connection.Close()
 
	// Create sesssion
	session, err := connection.NewSession()
	if err != nil {
		// return nil, fmt.Errorf("Failed to create session: %s", err)
		fmt.Printf("Failed to create session: %s\n", err)
	}
	defer session.Close()

	// StdinPipe for commands
	stdin, err := session.StdinPipe()
	if err != nil {
		log.Fatal(err)
	}
 
	// Uncomment to store output in variable
	//var b bytes.Buffer
	//sess.Stdout = &amp;b
	//sess.Stderr = &amp;b
 
	// Enable system stdout
	// Comment these if you uncomment to store in variable
	session.Stdout = os.Stdout
	session.Stderr = os.Stderr
 
	// Start remote shell
	err = session.Shell()
	if err != nil {
		log.Fatal(err)
	}
 
	// send the commands
	commands := []string{
		"pwd",
		"whoami",
		"echo 'bye'",
		"exit",
	}
	for _, cmd := range commands {
		_, err = fmt.Fprintf(stdin, "%s\n", cmd)
		if err != nil {
			log.Fatal(err)
		}
	}
 
	// Wait for sess to finish
	err = sess.Wait()
	if err != nil {
		log.Fatal(err)
	}
 
	// Uncomment to store in variable
	//fmt.Println(b.String())
 
}