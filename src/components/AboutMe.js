import React, { } from 'react';
import me from '../images/me.png';

function AboutMe() {

	return (
		<div style={{ textAlign: "center", height: 'calc(100% - 80px)', maxWidth: "100%" }}>		
				<div style={{ display: "inline-block", verticalAlign: "top", padding: "2em" }}>
					<img alt={`That's me`} style={{ borderRadius: "50%", maxWidth: "13em", width: "100%", height: "auto" }}
						src={me} />
				</div>
				<p style={{ display: "inline-block", textAlign: "left", maxWidth: "30em", padding: "2em" }}><h3>Hi Everybody,</h3>
					Welcome in my gallery from travelling around the World ;)
					<br /><br />
					If you want to log in, don&#39;t hesitate and use guest account <b>guest@paligator.sk/Password123</b>
					<br /><br />
					If you find bug or have suggestions for improvements, please, let me know <b>paligator@gmail.com</b> ;)
					<br /><br />
					If you are interested in source code, check <a target="_blank" rel="noopener noreferrer" href="https://github.com/paligator/photo-lib-web/">github-web</a> and <a target="_blank" rel="noopener noreferrer" href="https://github.com/paligator/photo-lib-api/">github-api.</a>
				</p>
		</div >
	)

}

export default AboutMe;
