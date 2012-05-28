Examples rule! See also **[[Docs]]**.

First of all, include in your pages Mootools 1.2.5 or later and *CrossDomainFragment.js* source.
You need these in the parent page and in the contained `<iframe>` page.

In the parent page, define the `<iframe>` element:

	<iframe src="http://www.example.com/iframe.html" id="iframe_element"</iframe>

And instantiate the communication object:

	var comm = new CrossDomainFragment({
		recipient: $('iframe_element'),
		onReceive: function(message) {
			$('inbox').set('text', message);
		}
	});
	
	// Then call send() method to send messages to the iframe window
	comm.send('Hello iframe!');

Also the page contained in the `<iframe>` has to instantiate **its own communication object**.
You can see that `recipient` option is not specified here, because it's `window.parent` by default.

	var comm = new CrossDomainFragment({
		onReceive: function(message) {
			$('inbox').set('text', message);
		}
	});
	
	// And send messages to the parent calling send() method
	comm.send('Hello parent!');