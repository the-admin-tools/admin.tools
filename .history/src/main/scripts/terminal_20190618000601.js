window.onload = function() {
    hterm.defaultStorage = new lib.Storage.Memory();
    lib.init(setupHterm, console.log.bind(console));
};

log = function(mesg) {
    console.log(mesg);
};

setupHterm = function() {
    opt_profileName = "default";
    const terminal = new hterm.Terminal(opt_profileName);
    const prompt_size = 7;
    terminal.onTerminalReady = function () {
        const io = terminal.io.push();

        function printPrompt() {
            io.print(
                '\x1b[38:2:51:105:232mh' +
                '\x1b[38:2:213:15:37mt' +
                '\x1b[38:2:238:178:17me' +
                '\x1b[38:2:51:105:232mr' +
                '\x1b[38:2:0:153:37mm' +
                '\x1b[38:2:213:15:37m>' +
                '\x1b[0m ');
            currentCursorState = terminal.saveCursorAndState();
        }

        currentCursorState = terminal.saveCursorAndState();
        const leaveIO = () => {
            io.print('');
            terminal.io.pop();
        };

        printPrompt();
        
        let input = '';
        io.sendString = (str) => input += str;
        currentCursorColumn = terminal.getCursorColumn();
        io.onVTKeystroke = (ch) => {
            switch(ch) {
                case '\x1b': // Esc pressed
                    leaveIO();
                    // rejects();
                    break;
                case '\r': // Enter key pressed
                    // leaveIO();
                    io.println('');
                    printPrompt();
                    // resolve(input);
                    break;
                case '\b': // backspace
                    input = input.slice(0, -1);
                    // terminal.eraseToLeft();
                    // io.print(input);
                    if(terminal.getCursorColumn() > prompt_size) {
                        terminal.setCursorColumn(terminal.getCursorColumn() - 1);
                        io.print(' ');
                        terminal.setCursorColumn(terminal.getCursorColumn() - 1);
                    }
                    break;
                case '\x7F': //delete
                    if(terminal.getCursorColumn() > prompt_size) {
                        
                    }
                    break;
                case '\x18':
                    break;
                default:
                    console.log(ch);
                    input += ch;
                    currentCursorState = terminal.saveCursorAndState();
                    io.print(ch);
                    break;
            }
            // terminal.wipeContents();
        };

        io.onTerminalResize = (columns, rows) => {

        };
        console.log("terminal is ready...");
    };
    
    terminal.prefs_.set('scrollbar-visible', false);
    terminal.prefs_.set('enable-blink', true);
    terminal.prefs_.set('backspace-sends-backspace', true);


    terminal.decorate(document.querySelector('#terminal'));
    terminal.installKeyboard();

    terminal.io.println('hello, world');
    terminal.setCursorPosition(0, 0);
    terminal.setCursorVisible(true);
    terminal.setCursorBlink(true);
    // terminal.command.keyboard_ = terminal.keyboard;

    terminal.contextMenu.setItems([
        ['clear', function() { terminal.wipeContents(); }],
        ['reset', function() { terminal.reset(); }],
    ]);

};