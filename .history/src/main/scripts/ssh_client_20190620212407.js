initPlugin_ = function() {
    console.log("loading plugin...");
  
    this.plugin_ = window.document.createElement('embed');
    this.plugin_.id = 'ssh_client';
    this.plugin_.type = 'application/x-nacl';
    this.plugin_.embed.width = 60;
    embed.height = 60;
    // this.plugin_.setAttribute('src', '../../plugin/pnacl/ssh_client.nmf');
    this.plugin_.setAttribute('type', 'application/x-nacl');
  
    this.plugin_.addEventListener('load', () => {
      console.log("plugin loaded successfully...");
      //setTimeout(this.onTTYChange_.bind(this));
      //onComplete();
    });
  
    this.plugin_.addEventListener('message', (e) => {
      const name = e.data.name;
      const arguments = e.data.arguments;
  
      console.log("name: ", name);
      console.log("arguments: ", arguments);
    //   if (name in this.onPlugin_) {
    //     this.onPlugin_[name].apply(this, arguments);
    //   } else {
    //     console.log('Unknown message from plugin', e.data);
    //   }
    });
  
    this.plugin_.addEventListener('crash', (e) => {
      console.log('plugin crashed');
    });
  
    document.body.insertBefore(this.plugin_, document.body.firstChild);
  
    // Set mimetype twice for https://crbug.com/371059
    this.plugin_.setAttribute('type', 'application/x-nacl');
  };

window.onload = function() {
    initPlugin_();
};