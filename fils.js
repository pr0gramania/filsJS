
// JavaScript for sort, filter, edit, table, string, change font, colour in HTML
// Программа сортировки таблицы по колонке и фильтрации строк по нажатию мыши на filter.gif

var sort_case_sensitive=1
var rd= /^(\d+)\.(\d+)\.(\d+)$/
var color=false, sortDisable=false
var newScript, e, x, y, yMenu
var pr=6 // промежуток между элементами
var menu, formF, sF='', tF, eF,eFu // для фильтра
var ch=false,ff=false,ie=false     // браузеры

a=navigator.userAgent.toLowerCase()
if (a.indexOf('chrome' )>0) ch=true; else
if (a.indexOf('firefox')>0) ff=true; else
if (a.indexOf('msie'   )>0) ie=true;
if (ie) String.prototype.trim = function() {return this.replace(/^[ \n\r]+|[ \n\r]+$/g, '')}

window.onload=onl
window.onkeydown=ok
window.onmousedown=fltr
document.oncontextmenu=menuC
window.ondblclick=dblclick


function sort(el,x,y) {
    if (sortDisable) return
    sortDisable=true
// el-клетка таблиц типа td, x - номер колонки, y - номер начальной строки

    var col_sort = del(el.innerHTML);
    var tr = el.parentNode;
    var table = tr.parentNode;
    var td, col_sort_num, txt;
    var s1="<font color='#CCCCCC'>&#9660;</font>"
    var s2="<font color='#CCCCCC'>&#9650;</font>"

// установка значка сортировки в заголовке таблицы
    for (var i=0; (td = tr.getElementsByTagName("td").item(i)); i++) {

        td.innerHTML=del(td.innerHTML)

        if (td.innerHTML==col_sort) {
            col_sort_num=i;
            if (td.prevsort=='y')  el.up=Number(!el.up);
            else {el.up=0; td.prevsort='y'}

            txt=delTag(td)//.innerHTML.replace(/<[^<]*?>/igm,'').trim()
            //if (color)
            td.innerHTML=td.innerHTML.replace(txt, (el.up==1?s1:s2)+del(txt));
        }

        else {
            if (td.prevsort == "y") {
                td.prevsort = "n";
            }
        }
    }

// сбор данных колонки в массив a[][0] и строк таблицы в a[][0]
    var a = new Array();
    for(i=y; i < table.rows.length; i++) {
        a[i-y] = new Array();
        a[i-y][0]=table.rows[i].getElementsByTagName("td").item(col_sort_num)
                .innerHTML.replace(/<[^<]*?>/igm,'');
        a[i-y][1]=table.rows[i];
    }

    a.sort(_sort);
    if(el.up) a.reverse();

// добавка отсортированных строк обратно в таблицу
    for(i=0; i<a.length; i++)
        table.appendChild(a[i][1]);
}

function del(s) {// удаление стрелки
  var n='',i; 
  for (i=0;i<s.length;i++)
    if (s.charCodeAt(i)<9600) n+=s.charAt(i);
    else esw=s.charCodeAt(i)==9650;
  return n; 
}

function delTag(td) {// удаление тегов
  return td.innerHTML.replace(/<[^<]*?>/igm,'').trim()
}

function _sort(a1, b1) {
    var a = a1[0];
    var b = b1[0];
    
    if (rd.exec(a.trim())) a=RegExp.$3+RegExp.$2+RegExp.$1
    if (rd.exec(b.trim())) b=RegExp.$3+RegExp.$2+RegExp.$1
    
    var _a = a.replace(/,/, '.');
    var _b = b.replace(/,/, '.');
    if (parseFloat(_a) && parseFloat(_b)) return parseFloat(_a)-parseFloat(_b);

    else if (!sort_case_sensitive) return sort_insensitive(a, b);
    else return sort_sensitive(a, b);
}

function sort_insensitive(a, b) {
    var anew = a.toLowerCase();
    var bnew = b.toLowerCase();
    if (anew < bnew) return -1;
    if (anew > bnew) return 1;
    return 0;
}


function sort_sensitive(a, b) {
    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
}

function onl() {// начальная сортировка
  var e,i;
  for (i=0;i<10;i++) {
    e=document.getElementById("startSort"+i)
    if (!e) break;
    if (/(\d+) *, *(\d+)/.exec(e.onmousedown))
      sort(e,RegExp.$1,RegExp.$2);
  }
  color=true
  colors('')
}

function ok(event) {
  if (event.altKey || event.ctrlKey) {
    if (event.keyCode==83) // alt+S
      send('sablon')
    if (event.keyCode==87) // alt+W
      send('word')
    if (event.keyCode==68) // alt+D
      location.href=location.href.replace('string1','string2')
    if (event.keyCode==88) // alt+X
//      txt.focus()
      location.href=location.href.replace('string1.html','string3.xml')
  }
  else if (event.keyCode==27) {hideMenu(); hideF(); if (ee) {ee.style.border=''; ee.contentEditable=false;}}
}

function send(par) {
  if (newScript!=undefined) document.body.removeChild(newScript)
  newScript=document.createElement('script')
  newScript.type='text/javascript'                                 // против кеширования
  newScript.src =location.href.replace(/\/.+/,'')+ '/'+par + '.html?r='+Math.random();
  document.body.appendChild(newScript)
}

// ФИЛЬТР ------------------------

var camt='#FFFFFF',cnm='#FFF4DA',czm='#FBDAB6'/*'#F4E4CA'*/, cnmt='#886000', cbm='#FACBA0'//, crm='#DF9060' // цвета меню
var br ='border-radius: 10px; -moz-border-radius: 10px; -webkit-border-radius: 10px; -khtml-border-radius: 10px;'
var b1='#FFE0C0', b2='#F0D0A0', b3='#F8C888', b4='#F0A878'
var shadow='box-shadow: 4px 4px 16px #888888;' // тень форм

var em,ee // мышенажатый и редактируемый элемент
var bo=ff? 'linear-gradient(to bottom, '+b3+','+b4+')' // окраска выделения с градиентом
         : '-webkit-gradient(linear, 0% 0%, 0% 100%, from('+b3+'), to('+b4+'))' //верх-низ
var h=28,hd=h-6, wb=100 // расстояние между элементами по вертикали и их высота, ширина кнопок
var cssI='font-weight: 100; color:'+cnmt+';padding-top:2px;padding-left:12px;cursor:pointer;' // для пункта меню
var cssZ='font-weight: 700; color:'+cnmt+';padding-top:6px;padding-left:12px;background-color: '+czm+';' // для подзаголовка меню
var shadow3=' -webkit-'+shadow+' -moz-'+shadow+' '+shadow
var css= 'background-color: '+cnm+'; border: '+cbm+' 4px solid;' +shadow3

bn=ff?'linear-gradient(to bottom, '+b3+','+b4+')' // окраска кнопок
        :'-webkit-gradient(linear, 0% 0%, 0% 100%, from('+b3+'), to('+b4+'))' //верх-низ
ba=ff?'linear-gradient(to bottom, '+b1+','+b2+')' // окраска кнопок с мышью
        :'-webkit-gradient(linear, 0% 0%, 0% 100%, from('+b1+'), to('+b2+'))' //верх-низ
var rba='#FFC0B0 1px solid',rbn='#D89888 1px solid' // рамки кнопок
var cba='#CD7856', cbn=camt // цвет текста кнопок
var shadow1='box-shadow: 2px 2px 4px #BBBBB0;' // тень кнопок
var bStyle='background-color: '+cnm+';color:'+camt+'; border:'+rbn+'; border-radius: 3px; '+ // стиль кнопок
    ' -webkit-'+shadow1+' -moz-'+shadow1+' '+shadow1+';background:'+bn

function fltr(event) {
    //if (menu || formF) {hideMenu(); hideF(); return}
    eF=event.target
    hideMenu();
    if (!eF.src || eF.src.indexOf('filter.gif')<0) return
    dom()
    showMenu(event)
}

function showMenu(event) {
  x=event.clientX
  y=event.clientY+scrollTop()
  menu =cd({x:x,y:y,  h:h*3-6, w:224, css:css})
  yMenu=0
  cm('Сортировка от '+(esw?'Я до А':'А до Я'), sortF)
  cm('Установить фильтр', function(){getStr();   return false})
  cm('Снять фильтр',      function(){setF(false);return false})
}

function hideMenu() {if (menu ) document.body.removeChild(menu);  menu =undefined }
function hideF()    {if (formF) document.body.removeChild(formF); formF=undefined }

function menuC(event) {// контектсное меню
  x=event.clientX
  y=event.clientY+scrollTop()
  em=event.target
  menu =cd({x:x,y:y,  h:h*14-6, w:224, css:css})
  yMenu=0
  cm('Изменения:')
  cm('Редактировать'  , editE)
  cm('Вставить строку', ins)
  cm('Удалить строку' , dels)
  cm('Шрифт:')
  cm('Calibri',   function(){fontS ('Calibri')})
  cm('Courier',   function(){fontS ('Courier')})
  cm('Times',     function(){fontS ('Times')  })
  cm('Arial',     function(){fontS ('Arial')  })
  cm('Цвет:')
  cm('Синий',     function(){colors('blue' )})
  cm('Серый',     function(){colors('gray' )})
  cm('Коричневый',function(){colors('kor'  )})
  cm('Ч.Б.',      function(){colors(''     )})
  return false
}

function colors(c) {
  var i,j,e,td,h,b,  f,r,z,t
  hideMenu()
//if (c=='blue') {f='#E2F8FF'; r='#BBC0FF'; z='#D0EFFF'; t='#F4FAFF'} else // фон общий, рамки таблицы, заголовок таблица
  if (c=='blue') {f='#87CEFA'; r='#5B89BF'; z='#76B2D4'; t='#F4FAFF'} else // фон общий, рамки таблицы, заголовок таблица
  if (c=='gray') {f='#F0F0F0'; r='#B0B0B0'; z='#D0D0D0'; t='#FAFAFA'} else
//if (c=='kor' ) {f='#FFF8E4'; r='#E0B0A0'; z='#F8DFC0'; t='#FFFAF4'} else
  if (c=='kor' ) {f='#FFE0B0'; r='#A0522D'; z='#F4C490'; t='#FFF8DC'} else
                 {f='#FFFFFF'; r='#000000'; z='#FFFFFF'; t='#FFFFFF'}

  document.body.style.backgroundColor=f
  for (i=0; (e=document.getElementsByTagName("table").item(i)); i++) {
    e.style.backgroundColor=t
    e.style.cssText+=shadow3
    h=0
    for (j=0; td=e.getElementsByTagName("td").item(j); j++) {
      td.style.borderColor=r
      b=td.style.borderBottom
      if (b.indexOf('1pt'  )==0 && h==1) h=2
      if (b.indexOf('1.5pt')==0) h=1
      if (h<2) td.style.backgroundColor=z
    }
  }
  return false
}

function editE() { // редактирование элемента em
  if (!em) return
  if (ee) ee.style.border=''
  em.contentEditable=true;
  em.style.border=cbm+' 2px solid'
  ee=em
}

function ins() { // вставка строки после элемента er или ep
  var i,j, r,td,tr
  dom()
  if (er && table) {
      for (i=0; (tr=table.getElementsByTagName('tr').item(i)); i++)
        if (tr==er) {
          r=table.insertRow(i+1);
          for (i=0; (td=tr.getElementsByTagName('td').item(i)); i++)
            r.insertCell(-1).outerHTML=td.outerHTML
          break
        }
  }
  else
  if (ep) {
    ep.parentNode.insertBefore(cp('Новая строка'),ep)
  }
}

function dels() { // удаление строки с элементом er или ep
    dom()
    if (er && tb )     tb.removeChild(er); else
    if (ep) ep.parentNode.removeChild(ep)
}

function fontS(n) {
  for (i=0; (e=document.getElementsByTagName("p").item(i)); i++) e.style.fontFamily=n
  hideMenu()
  return false
}

function getStr() {// форма получения строки фильтра
  var w=520, hf=h*8
  hideMenu()
  formF=cd({x:x,y:y,  h:hf, w:w, css:css+br})
  cd({p:formF, t:'Пользовательский автофильтр', x:0, y:0, h:h-8, w:w, css:'padding-left:8px;padding-bottom:4px;color:'+camt+';background:'+bo}) //border:#AA0000 1px solid;
  var e=eF.parentNode
  var s= del(e.textContent).trim()
  cd({p:formF, t:s, x:10, y:h+4, w:w-20, css:'font-weight: 700;'})
    var sel=
       '<select id="tipF" style="border:none;background-color: '+cnm+';font:18px Calibri; height:20;">'+
       '  <option value="содержат">содержат'+
       '  <option value="не содержат">не содержат'+
       '</select>'
    cd({p:formF, t:'Показать только те строки, значения которых '+sel, x:10, y:h*2+4, w:w-20, css:'z-Index:9;'})


  txt=ctf({p:formF, t:sF, x:16, y:h*3+8, w:w-16})
  txt.onkeydown=function(e) {if (e.keyCode==13) setF(true)}
  setTimeout('txt.focus()', 100)
  cd({p:formF, t:'Знак вопроса "?" обозначает один любой знак<br>' +
                 'Знак "*" обозначает последовательность любых знаков<br>' +
                 'Знак "|" обозначает ИЛИ<br>', x:10, y:h*4+8, w:w-20, f:16, css:'color:#444444'})
  cb({p:formF, v:'OK',     f:function(){setF(true)}, x:w+8-wb*2, y:hf+8-h})
  cb({p:formF, v:'Oтмена', f:hideF, x:w+8-wb, y:hf+8-h})
}

function setF(set){ // установка фильтра или снятие
  sF=txt.value;
  tF=set? id('tipF').value : ''
  if (sF) {
    var tr,td, s, i, e,n
    if (!er && ep ) { // фильтр на строки до пустой строки
      for (i=0; (e=document.getElementsByTagName("p").item(i)); i++) {
        if (n) {
          if (e.textContent.trim()=='') break
          setE(e,e,set)
        }
        if (e==ep) n=i
      }
    }
    if (tb)
    for (i=ns; (tr=tb.getElementsByTagName("tr").item(i)); i++) {
       setE(tr,tr.getElementsByTagName("td").item(nc),set)
    }

    if (eFu) eFu.style.border=''
    eF.style.border=set?'#FF8844 1px solid':''
    eFu=eF
  }
  hideMenu()
  hideF()
}

function setE(e,e1,set) {// установка, снятие фильтра элемента e по содержимому элемента e1
  var s=e1.textContent.toLocaleLowerCase(), p=sF.toLocaleLowerCase(), d
  if (p.search(/[\*\?\|]/)>=0) { // как рег
    p=p.replace('*','.*').replace('?','.').replace('.','\.')
    d=s.search(new RegExp(p),'igm')>=0
  }
  else d=s.indexOf(p)>=0
  if (tF.indexOf('не')==0) d=!d
  e.style.display = !set || d? 'table-row':'none'
}

var er,ec,nc,ns,tb,table,ep, esw // определяемое в dom,  esw-есть сортировка по вознастанию

function dom(){// определение номера колонки - nc элемента eF и строки от начала таблицы - ns и строки - er
//  hideMenu();
  var e=eF, e1, td,i
  for (er=tb=ep=undefined, esw=nc=0, ns=1; e; e=e.parentNode) {
    try{
    if (e.nodeName=='TD') {ec=e; del(e.innerHTML)} else
    if (e.nodeName=='P' ) {ep=e;} else
    if (e.nodeName=='TR') {
        for (i=0; (td=e.getElementsByTagName("td").item(i)); i++)
          if (td==ec) nc=i
        er=e;
    }
    else
    if (e.nodeName=='TBODY') {tb=e; if (e.firstChild!=er) ns=2;}
    if (e.nodeName=='TABLE') table=e;
    } catch(e) {}
  }
}

function sortF(){// сортировка по колонке где eF
  hideMenu()
  sortDisable=false
  sort(ec,nc,ns)
}

function overM(event){
    if (!ie) {
      event.target.style.color =camt;
      event.target.style.background=bo
    }
}

function blurM(event){
  if (!ie) {
    event.target.style.color =cnmt
    event.target.style.background=cnm //'linear-gradient(to top, #F0F0E8, #F8F8F8)';
  }
}

function overB(e){
  if (!ie) {
    e.target.style.color =cba
    e.target.style.border=rba
    e.target.style.background=ba
  }
}

function blurB(e){
  if (!ie) {
    e.target.style.color =cbn
    e.target.style.border=rbn
    e.target.style.background=bn
 }
}


function dblclick(event) {
  em=event.target
  editE()
  return false
}

function cd(p) {// создание div
  var d=document.createElement('div')
  var x=p.x?p.x:0, y=p.y?p.y:0, h=p.h?p.h:h, w=p.w?p.w:wb, f=p.f?p.f:18, z=p.z?p.z:0, css=p.css?p.css:''
  if (p.id)   d.id=p.id
  if (p.md)   d.onmousedown=p.md
  if (p.over) d.onmouseover=p.over
  if (p.out)  d.onmouseout =p.out
  if (p.t)    d.innerHTML  =p.t
  d.style.cssText='font:'+f+'px Calibri;position:absolute;top:'+y+';left:'+x+';height:'+h+';width:'+w+';z-Index:'+z+';padding:6px;'+css;
  (p.p?p.p:document.body).appendChild(d)
  return d
}

function cp(t) { // создание p
    var p=document.createElement('p')
    p.setAttribute('class',"MsoNormal")
    p.style.cssText="text-align:left;text-indent:0cm;"
    p.innerHTML=t
     //'<p class="MsoNormal" style="text-align:left;text-indent:0cm;"><span>'+t+'</span></p>'
    return p
}

function ctf(p) {// создание поля ввода
  var t= document.createElement('input'); t.type='text'; t.value=p.t;
  t.style.cssText='font:16px courier;position:absolute;top:'+ p.y+'px;left:'+ p.x+'px;height:'+h+'px;width:'+ p.w+'px; z-index:99; border:#AAAAAA 1px solid;padding-left:4px;';
  (p.p?p.p:document.body).appendChild(t)
  return t
}

function cb(p) {// создание кнопки
  var b=document.createElement('input'), hb=p.h? p.h:h-pr; b.type='button'; b.value=p.v; b.onclick=p.f
  if (p.id) b.id=p.id
  b.style.cssText='cursor:pointer;position:absolute; top:'+p.y+'px;left:'+p.x+'px;height:'+hb+'px;width:'+(wb-pr)+'px;'+bStyle;
  (p.p?p.p:document.body).appendChild(b)
  b.onmouseover=overB
  b.onmouseout=blurB
  return b
}

function cm(t,md) { // создание пункта меню c постоянными параметрами
  yMenu+=h
  return md? cd({x:2,y:2+yMenu-h, p:menu, h:hd,  w:214, css:cssI, over:overM, out:blurM, f:18, t:t, z:9, md:md})
          :  cd({x:2,y:2+yMenu-h, p:menu, h:hd-6,w:214, css:cssZ, f:16, t:t,z:0})

}

function id(x) {return document.getElementById(x);}
function scrollTop() {// величина прокрутки документа по вертикали
  doc=document
  return (doc.documentElement.scrollTop>doc.body.scrollTop) ? doc.documentElement.scrollTop : doc.body.scrollTop
}
