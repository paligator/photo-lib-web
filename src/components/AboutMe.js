import React, { } from 'react';
import me from '../images/me.png';

function AboutMe() {

	return (
		<div style={{ width: "100%", textAlign: "center" }}>

			<div className="flexRow" style={{ padding: "1em", marginTop: "15vh" }}>
				<div>
					<img alt={`That's me`} style={{ borderRadius: "50%", maxWidth: "13em", width: "100%", height: "auto" }}
						src={me} />
				</div>
				<div style={{ textAlign: "left", marginLeft: "3em", width: "31em" }}><h3>Hi Everybody,</h3>
					Welcome in my gallery from travelling around the World ;)
					<br /><br />
					If you want to log in, don&#39;t hasitate and use guest account <b>guest@paligator.sk/Password123</b>
					<br /><br />
					If you find bug or have suggestions for improvments, please, let me know <b>paligator@gmail.com</b> ;)
					<br /><br />
					If you are interested in source code, check <a target="_blank" rel="noopener noreferrer" href="https://github.com/paligator/photo-lib-web/">github-web</a> and <a target="_blank" rel="noopener noreferrer" href="https://github.com/paligator/photo-lib-api/">github-api.</a>
				</div>
			</div>


		</div >
	)

}

export default AboutMe;
