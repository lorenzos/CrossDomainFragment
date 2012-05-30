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
		recipient: null, // Can be an <iframe> element, if null window.parent will be used
		pollingInterval: 250 // Hash string checks frequency
	},
	
	initialize: function(options) {
		
		this.setOptions(options);
		if (this.options.recipient == null) this.options.recipient = window.parent;
		this.lastMessageStringReceived = '';
		
		// Get origin URL
		this.getOrigin();
		
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
		
		// Wait for origin...
		if (!this.origin) {
			this.send.bind(this, message).delay(this.options.pollingInterval * 2);
			return this;
		}
		
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
	
	getOrigin: function() {
		
		// If recipient is an iframe, I can get origin now
		if (this.options.recipient != window.parent) {
			this.setOrigin(this.options.recipient.src);
			
			// Send origin-initialization message to the iframe
			var encodedMessage = encodeURIComponent(JSON.encode({ origin: window.location.href }));
			this.options.recipient.src = this.origin + "#" + encodedMessage;
			
		}
		
	},
	
	setOrigin: function(origin) {
		var hasHash = origin.indexOf('#');
		if (hasHash > 0) this.origin = origin.substr(0, hasHash); // Remove #hash part
		else this.origin = origin;
	},
	
	poll: function() {
		
		// Get hash string
		var messageString = decodeURIComponent(window.location.hash.substr(1));
		
		// If hash string is "new"
		if (messageString != this.lastMessageStringReceived) {
			this.lastMessageStringReceived = messageString; // Store last hash string
			
			// It's an origin-initilization message?
			var decodedMessage = JSON.decode(messageString);
			if (decodedMessage.origin) {
				this.setOrigin(decodedMessage.origin);
				
			// Normal message
			} else {
				var message = this.unpackMessage(decodedMessage); // Unpack
				this.fireEvent('receive', message);
			}
			
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