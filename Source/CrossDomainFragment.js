/*
---
description: A class that provides cross-domain communication between an iframe element and its parent window.

license: MIT-style

authors:
- Lorenzo Stanco

requires:
- core/1.2.5:Class
- core/1.2.5:Class.Extras
- core/1.2.5:JSON

provides: 
- CrossDomainFragment

credits: http://www.ibm.com/developerworks/web/library/wa-crossdomaincomm/

...
*/

var CrossDomainFragment = new Class({
	
	Implements: [Options, Events],
	
	options: {
		recipient: window.parent, // Can be an <iframe> element
		pollingInterval: 250 // Hash string checks frequency
	},
	
	initialize: function(options) {
		
		this.setOptions(options);
		this.lastMessageStringReceived = '';
		
		// Get origin URL
		this.origin = (this.options.recipient.location) ? this.options.recipient.location.href : this.options.recipient.src;
		var hasHash = this.origin.indexOf('#');
		if (hasHash > 0) this.origin = this.origin.substr(0, hasHash);
		
		// Start polling
		this.start();
		return this;
		
	},
	
	start: function() {
		this.interval = this.poll.bind(this).periodical(this.options.pollingInterval); // Start polling
		return this;
	},
	
	stop: function() {
		clearInterval(this.interval); // Stop polling
		return this;
	},
	
	send: function(message) {
	
		// Encode message and generate URL
		var encodedMessage = encodeURIComponent(JSON.encode(this.packMessage(message)));
		var encodedMessageUrl = this.origin + "#" + encodedMessage;
		
		// Write message in the hash string
		if (this.options.recipient.location) {
			this.options.recipient.location.href = encodedMessageUrl;
		} else {
			this.options.recipient.src = encodedMessageUrl;
		}
		
		this.fireEvent('send', message);
		
		return this;
		
	},
	
	poll: function() {
		
		// Get hash string
		var messageString = decodeURIComponent(window.location.hash.substr(1));
		
		// If hash string is "new"
		if (messageString != this.lastMessageStringReceived) {
			this.lastMessageStringReceived = messageString; // Store last hash string
			var message = this.unpackMessage(JSON.decode(messageString)); // Unpack
			this.fireEvent('receive', message);
		}
		
		return this;
		
	},
	
	packMessage: function(message) {
	
		// Encapsulate messages and add a timestamp.
		// This allows the same message to be sent twice and not being discarded.
		return {
			c: new Date().getTime(),
			m: message
		};
		
	},
	
	unpackMessage: function(pack) {
		return pack.m;
	}
	
});