import React from 'react';

export default function Footer() {
	return (
		<div className="footer">
      Made by Barry McAndrews © <s>1995</s> <i>{new Date().getFullYear()}</i>
    </div>
	);
}
