CrossDomainFragment
===================

A Mootools class that provides cross-domain communication
between an *<iframe>* element and its parent window using the
fragment id technique as same-origin-policy workaround.

![Screenshot](http://www.ibm.com/developerworks/web/library/wa-crossdomaincomm/fragment.gif)


How to use
----------

First of all, include in your pages Mootools 1.2.5 or later and *CrossDomainFragment.js* source.
You need these in the parent page and in the contained *<iframe>* page.

In the parent page, define the *<iframe>* element:

	#HTML
	
	<iframe src="http://www.example.com/iframe.html" id="iframe_element"</iframe>

And instantiate the communication object:

	#JS
	
	var comm = new CrossDomainFragment({
		recipient: $('iframe_element'),
		onReceive: function(message) {
			$('inbox').set('text', message);
		}
	});
	
	// Then call send() method to send messages to the iframe window
	comm.send('Hello iframe!');

Also the page contained in the *<iframe>* has to instantiate **its own communication object**.
You can see that *recipient* option is not specified here, because it's *window.parent* by default.

	#JS
	
	var comm = new CrossDomainFragment({
		onReceive: function(message) {
			$('inbox').set('text', message);
		}
	});
	
	// And send messages to the parent calling send() method
	comm.send('Hello parent!');

Docs
----

**Implements:** Options, Events

**Syntax:**
	
	#JS
	
	var comm = new CrossDomainFragment(options);

- **options**: (*object*) Options for the class. They are all listed below.

**Options:**

- **recipient**: An *<iframe>* element or a *window* object (default *window.parent*).
- **pollingInterval**: Defines the interval in milleseconds between each hash fragment check (default: *250*). It has to be shorter than the minimum expected inteval between two incoming messages.

**Events:**

- **receive(message)**: A message has been received.
- **send(message)**: A message has been sent.

**Methods:**

- **send(message)**: Sends a message.
- **start()**: Starts listening for incoming messages (called automatically).
- **stop()**: Stops listening for incoming messages.
