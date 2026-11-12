const fs=require('fs');const h=fs.readFileSync(__dirname+'/index.html','utf8');
const code=h.split('/*CORE*/')[1].split('/*ENDCORE*/')[0];
const C=new Function(code+';return {solveLaw,dalton,altitude};')();
const I=(o)=>{const r={};for(const k in o)r[k]={v:String(o[k][0]),u:o[k][1]};return r;};
const T=[];const chk=(n,exp,got,tol)=>{const ok=Math.abs(got-exp)<=tol*Math.abs(exp);T.push([n,exp,got,ok]);};
let r=C.solveLaw('boyle','P2',I({P1:[2,'atm'],V1:[3,'L'],V2:[1.5,'L']}));chk('1 Boyle P2 (atm)',4,r.value,1e-9);
r=C.solveLaw('charles','V2',I({V1:[2,'L'],T1:[25,'°C'],T2:[100,'°C']}));chk('2 Charles V2 (L)',2*373.15/298.15,r.value,1e-9);
r=C.solveLaw('gay','P2',I({P1:[760,'mmHg'],T1:[300,'K'],T2:[360,'K'],P2:['','mmHg']}));chk('3 Gay-Lussac P2 (mmHg)',912,r.value,1e-9);
const d=C.dalton('moles',[{name:'N2',v:'3'},{name:'O2',v:'1'}],{v:'2',u:'atm'},'atm');
chk('4 Dalton X(N2)',0.75,d.rows[0].X,1e-9);chk('4 Dalton P(N2) atm',1.5,d.rows[0].P,1e-9);chk('4 Dalton P(O2) atm',0.5,d.rows[1].P,1e-9);
const a=C.altitude('11000');chk('5 Altitud 11000 m (Pa) ref. ISA 22632',22632,a.P,2e-3);
chk('5b Altitud 0 m (Pa)',101325,C.altitude('0').P,1e-12);
chk('6 General T2 (K)',450,C.solveLaw('general','T2',I({P1:[1,'atm'],V1:[2,'L'],T1:[300,'K'],P2:[2,'atm'],V2:[1.5,'L']})).value,1e-9);
for(const t of T)console.log((t[3]?'OK  ':'FALLA ')+t[0]+' esperado='+t[1]+' obtenido='+t[2]);
const bad=[['T=-300 °C',()=>C.solveLaw('charles','V2',I({V1:[2,'L'],T1:[-300,'°C'],T2:[100,'K']}))],
['V=0',()=>C.solveLaw('boyle','P2',I({P1:[2,'atm'],V1:[0,'L'],V2:[1,'L']}))],
['T=0 K',()=>C.solveLaw('gay','P2',I({P1:[1,'atm'],T1:[0,'K'],T2:[300,'K']}))],
['campo vacío',()=>C.solveLaw('boyle','P2',I({P1:[2,'atm'],V1:['','L'],V2:[1,'L']}))],
['texto',()=>C.solveLaw('boyle','P2',I({P1:['abc','atm'],V1:[1,'L'],V2:[1,'L']}))],
['P negativa',()=>C.solveLaw('boyle','V2',I({P1:[-1,'atm'],V1:[1,'L'],P2:[1,'atm']}))],
['altitud 12000',()=>C.altitude('12000')],['moles 0',()=>C.dalton('moles',[{v:'0'},{v:'1'}],{v:'1',u:'atm'})],
['1 solo gas',()=>C.dalton('moles',[{v:'1'}],{v:'1',u:'atm'})]];
for(const[n,f]of bad){try{f();console.log('FALLA rechazo '+n+': no lanzó error');}catch(e){console.log('OK  rechaza '+n+' → '+e.message);}}
console.log(C.solveLaw('charles','V2',I({V1:[2,'L'],T1:[25,'°C'],T2:[100,'°C']})).steps.map(s=>s[0]+'\n'+s[1]).join('\n'));
console.log('Bogotá 2640 m:',C.altitude('2640').P.toFixed(1),'Pa');
