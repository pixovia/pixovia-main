import React from "react";

export default function ShutdownModal({ onClose }) {
return (
<div style={overlay}>
<div style={modal}>

<h2>⚠ Pixovia Shutdown</h2>

<p>
Pixovia services are shut down.
</p>

<p>
This site is running layout-only mode.
Database connections are disconnected.
</p>

<p>
All code & data:
</p>

<a href="https://github.com/pixovia" target="_blank">
github.com/pixovia
</a>

<br/><br/>

<p>New Frontend:</p>

<a href="https://pixovia.github.io" target="_blank">
pixovia.github.io
</a>

<br/><br/>

<button onClick={onClose} style={btn}>
Continue
</button>

</div>
</div>
);
}

const overlay = {
position:"fixed",
top:0,
left:0,
right:0,
bottom:0,
background:"rgba(0,0,0,0.9)",
display:"flex",
alignItems:"center",
justifyContent:"center",
zIndex:999999
};

const modal = {
background:"#0f172a",
color:"white",
padding:"30px",
borderRadius:"12px",
maxWidth:"500px",
textAlign:"center"
};

const btn = {
padding:"10px 20px",
background:"#2563eb",
border:"none",
color:"white",
borderRadius:"6px",
cursor:"pointer"
};
