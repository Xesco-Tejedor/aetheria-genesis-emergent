// Small original WebGL renderer. No external assets or runtime downloads.
// Meshes have depth, directional light and emissive life; camera is orthographic.
const palette=[[.27,.33,.35],[0,.94,1],[.12,.78,.65],[0,1,.53],[.25,.85,.5],[.66,.95,.3],[.82,0,1],[.58,.28,.96],[.95,.94,.63]];
function shader(gl,type,src){let s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));return s}
export function renderer(canvas){
 const gl=canvas.getContext('webgl',{antialias:true,alpha:false,preserveDrawingBuffer:true});if(!gl)throw Error('WebGL no disponible en este navegador');
 const vs=`attribute vec3 aPosition;attribute vec3 aColor;attribute float aGlow;uniform float uAngle;uniform vec3 uScale;uniform vec2 uPan;varying vec3 vColor;varying float vGlow;varying float vDepth;void main(){float x=aPosition.x*cos(uAngle)-aPosition.y*sin(uAngle);float y=aPosition.x*sin(uAngle)+aPosition.y*cos(uAngle);float py=y*.54-aPosition.z*.84;float depth=y*.84+aPosition.z*.54;gl_Position=vec4(x*uScale.x+uPan.x,-py*uScale.y+uPan.y,-depth*uScale.z,1.);vColor=aColor;vGlow=aGlow;vDepth=py;}`;
 const fs=`precision mediump float;varying vec3 vColor;varying float vGlow;varying float vDepth;void main(){vec3 fog=vec3(.028,.05,.073);float f=clamp(abs(vDepth)*.009,0.,.3);vec3 c=mix(vColor,fog,f);c+=vGlow*.13*vColor;gl_FragColor=vec4(c,1.);}`;
 let prog=gl.createProgram();gl.attachShader(prog,shader(gl,gl.VERTEX_SHADER,vs));gl.attachShader(prog,shader(gl,gl.FRAGMENT_SHADER,fs));gl.linkProgram(prog);if(!gl.getProgramParameter(prog,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(prog));gl.useProgram(prog);
 let buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);for(let [name,n,offset]of [['aPosition',3,0],['aColor',3,12],['aGlow',1,24]]){let loc=gl.getAttribLocation(prog,name);gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,n,gl.FLOAT,false,28,offset)}
 gl.enable(gl.DEPTH_TEST);gl.depthFunc(gl.LEQUAL);let verts=[];
 function tri(a,b,c,col,glow=0){let u=b.map((x,i)=>x-a[i]),v=c.map((x,i)=>x-a[i]),nx=u[1]*v[2]-u[2]*v[1],ny=u[2]*v[0]-u[0]*v[2],nz=u[0]*v[1]-u[1]*v[0],len=Math.hypot(nx,ny,nz)||1;let light=glow?1:.44+.56*Math.abs((nx*.3+ny*-.4+nz*.86)/len);for(let p of [a,b,c])verts.push(...p,col[0]*light,col[1]*light,col[2]*light,glow)}
 function prism(x,y,z,r,height,sides,col,glow=0,phase=0){let top=z+height;for(let i=0;i<sides;i++){let a=phase+i*Math.PI*2/sides,b=phase+(i+1)*Math.PI*2/sides,p=[x+Math.cos(a)*r,y+Math.sin(a)*r,z],q=[x+Math.cos(b)*r,y+Math.sin(b)*r,z],pt=[p[0],p[1],top],qt=[q[0],q[1],top];tri([x,y,top],pt,qt,col,glow);tri(p,q,qt,col,glow);tri(p,qt,pt,col,glow)}}
 function crystal(x,y,z,r,h,col,glow=1){for(let i=0;i<6;i++){let a=i*Math.PI/3,b=(i+1)*Math.PI/3;tri([x+Math.cos(a)*r,y+Math.sin(a)*r,z],[x+Math.cos(b)*r,y+Math.sin(b)*r,z],[x,y,z+h],col,glow)}}
 function branch(a,b,r,col){let dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy)||1,ox=-dy/l*r,oy=dx/l*r;tri([a[0]+ox,a[1]+oy,a[2]],[a[0]-ox,a[1]-oy,a[2]],[b[0],b[1],b[2]],col,1)}
 return {gl,draw(world,view,selected,time){let rect=canvas.getBoundingClientRect(),W=rect.width,H=rect.height,dpr=Math.min(devicePixelRatio||1,2);if(canvas.width!==Math.round(W*dpr)||canvas.height!==Math.round(H*dpr)){canvas.width=Math.round(W*dpr);canvas.height=Math.round(H*dpr)}gl.viewport(0,0,canvas.width,canvas.height);gl.clearColor(.028,.046,.065,1);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.useProgram(prog);let size=Math.min(W/33,H/23)*view.zoom;gl.uniform1f(gl.getUniformLocation(prog,'uAngle'),view.angle);gl.uniform3f(gl.getUniformLocation(prog,'uScale'),2*size/W,2*size/H,.025);gl.uniform2f(gl.getUniformLocation(prog,'uPan'),view.panX*2/W,-view.panY*2/H);verts=[];let points=[];
 for(let i=0;i<world.cells.length;i++){let c=world.cells[i],x=Math.sqrt(3)*(c.q+c.r*.5),y=1.5*c.r,z=c.h*.32;let rx=x*Math.cos(view.angle)-y*Math.sin(view.angle),ry=x*Math.sin(view.angle)+y*Math.cos(view.angle);points.push({i,px:W/2+rx*size+view.panX,py:H/2+(ry*.54-z*.84)*size+view.panY});
 let base=c.mat==='concrete'?[.30,.31,.32]:c.mat==='alloy'?[.27,.31,.39]:c.mat==='leak'?[.32,.18,.13]:c.mat==='crystal'?[.25,.20,.3]:c.tox>.3?[.22,.17,.19]:[.13,.23,.24];
 prism(x,y,z-.45,.96,.45,6,base,0,Math.PI/6);
 if(i===selected){prism(x,y,z+.006,.98,.025,6,[.8,.92,.82],1,Math.PI/6);prism(x,y,z+.033,.88,.02,6,base,0,Math.PI/6)}
 if(c.t){let col=palette[c.t],life=c.p;let pul=.8+.2*Math.sin(time*.002+i);prism(x,y,z+.01,.55*life,.025,6,col.map(v=>v*.22),1,Math.PI/6);
 if(c.t<=2){for(let k=0;k<4;k++){let a=k*1.8+i;branch([x,y,z+.08],[x+Math.cos(a)*.7,y+Math.sin(a)*.7,z+.06],.06,col)}for(let k=0;k<3;k++)crystal(x+Math.sin(i+k)*.3,y+Math.cos(i+k)*.3,z,.10,.15+life*.13,col)}
 else if(c.t<=5){let h=c.t===4?1.8:.7;prism(x,y,z,.085,h,5,col,1);for(let k=0;k<4;k++){let a=k*2.3+i;crystal(x+Math.cos(a)*.3,y+Math.sin(a)*.3,z+h*(.25+k*.16),.28,.24,col)}if(c.t===5)crystal(x,y,z+h,.24,.3,[.8,.9,.35])}
 else if(c.t===6){let a=time*.001+i,xx=x+Math.cos(a)*.6,yy=y+Math.sin(a)*.6;crystal(xx,yy,z+1,.16,.32,col);branch([xx,yy,z+1.2],[xx+.55,yy+.15,z+1.35+Math.sin(time*.02)*.1],.2,[.7,.35,1]);branch([xx,yy,z+1.2],[xx-.55,yy-.15,z+1.35-Math.sin(time*.02)*.1],.2,[.7,.35,1])}
 else if(c.t===7){prism(x,y,z,.5,.4,6,col);crystal(x,y,z+.4,.35,.35,[.5,.6,.7]);}
 else{prism(x,y,z,.18,2.8,7,[.16,.55,.4]);for(let k=0;k<9;k++){let a=k*2.4;crystal(x+Math.cos(a)*.8,y+Math.sin(a)*.8,z+1.8+(k%3)*.4,.6,.9,col)}for(let k=0;k<6;k++){let a=k*Math.PI/3;branch([x,y,z+.05],[x+Math.cos(a)*1.2,y+Math.sin(a)*1.2,z+.05],.16,col)}}
 }else if(c.mat==='concrete'){prism(x,y,z,.38,.7,4,[.46,.48,.45],0,.2);prism(x+.25,y+.22,z,.2,.4,4,[.3,.34,.35],0,.2)}else if(c.mat==='alloy'){prism(x,y,z,.55,.35,6,[.5,.55,.64]);prism(x,y,z+.35,.21,.5,8,[.21,.3,.36])}else if(c.mat==='leak'){prism(x,y,z,.3,.6,8,[.6,.32,.15]);prism(x,y,z+.6,.29,.05,8,[.95,.55,.24],1)}else if(c.mat==='crystal')crystal(x,y,z,.5,.8,[.5,.3,.55]);
 }
 gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(verts),gl.DYNAMIC_DRAW);gl.drawArrays(gl.TRIANGLES,0,verts.length/7);return points;
 },dispose(){gl.deleteBuffer(buffer);gl.deleteProgram(prog)}};
}
