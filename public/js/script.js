'use strict';
    
let lastRow = document.querySelector('table tbody tr:last-child td:nth-child(2)');
var lastRowId = lastRow ? parseInt(lastRow.innerText) : 0;


function searchNote(q) {
    if(!q) {
        AJAX.post('/load-more', {
            id: 0,
            limit: 20
        }).then(rows => {
            lastRowId = rows[rows.length - 1].id;

            let tbody = '';
            rows.forEach((row, ind) => {
                tbody += '<tr><td>' + (ind + 1) + '</td><td>' + row.id + '</td><td>' + row.filename + '</td><td>' + row.info + '</td></tr>';
            });

            document.querySelector('#tableload tbody').innerHTML = tbody;
        });
    }
     else {
        AJAX.get('/search', {
            q: q
        
        }).then(res => {
            if(res.code == 1) {
                let tbody = '';
                res.rows.forEach((row, ind) => {
                    tbody += '<tr><td>' + (ind + 1) + '</td><td>' + row.id + '</td><td>' + row.filename + '</td><td>' + row.info + '</td></tr>';
                });

                document.querySelector('#tableload tbody').innerHTML = tbody;
            }
        });
    }
}

function sharefile()
{
AJAX.get('/sharedfiles' ,(res) =>{

}).then(res => {
    if(res.code==1) {
        let tbody='';
        let Edit='';
        let view='';
        res.rows.forEach((row,ind) => {
             if(row.edit==true)
             {
            tbody +='<tr><td>' + (ind + 1) + "</td><td id='row'>" + row.id + '</td><td><a style="text-decoration-line:none;" href="/view/' + row.filename +'">' + row.filename + '</a></td><td>' + row.info + '</td><td><button><a href="' + row.id +'">Edit</a></button></td></tr>';
                    var row=document.getElementById('row');
             }
             else{
                tbody +='<tr><td>' + (ind + 1) + "</td><td id='row'>" + row.id + '</td><td><a style="text-decoration-line:none;" href="/view/'+row.filename+'">' + row.filename + '</a></td><td>' + row.info + '</td><td><b>&nbsp;&nbsp;&nbsp;No permissions yet!</b></td></tr>';
             }
        });
        
        document.querySelector('#tableshare tbody').innerHTML=tbody;
        
    }
   }); 
}
     
  


    
  


function DeleteNote(id, el) {
     

    AJAX.post('/delete', {
        id: id
    }).then(res => {
        alert(res.message);
        if(res.code == 1) {
            el.parentElement.parentElement.remove();

            document.querySelectorAll('table tbody tr').forEach((row, ind) => {
                row.querySelector('td').innerHTML = (ind + 1);
            });
        }
    });
}


function saveNote(e) {
    e.preventDefault();
     
    if(window.location.pathname == '/editor') {
        var filename;
        var userData=JSON.parse(localStorage.getItem('userData') ||'{}');
         var filename=userData.filename;
     let xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
        if(this.status == 200 && this.readyState == 4) {
            // success
            alert(this.responseText);
        }
    }
    xhr.onerror = function() {
        alert('Something went wrong. Failed to save data.');
    }
    if(localStorage.getItem("userData")==null)
    {
        filename=prompt("enter the filename","");
        if (filename==null || filename=="") {
            alert("plz enter the filename!!");
        }
        else{
         localStorage.setItem('userData', JSON.stringify({
                
                filename:filename
            }));
 
    
    xhr.open('POST', '/save-content', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({
        
        username:document.getElementById('user_name').innerHTML,
        content_name: filename,
        content: document.getElementById('content').innerHTML
    }));
    
    } 
    }
    else
    {
       xhr.open('POST', '/update1', true);
        var userData=JSON.parse(localStorage.getItem('userData') ||'{}');
            var filename=userData.filename;
       localStorage.getItem('filename');
    console.log(filename);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({
             //id: parseInt(window.location.pathname.split('/')[1]),
             content_name:filename,
            content: document.getElementById('content').innerHTML
    }));  
   //
    }
}
    else if (window.location.pathname=='/view')
    {
      alert('wrong');
    }
    else {

            let xhr = new XMLHttpRequest();
           xhr.onreadystatechange = function() {
        if(this.status == 200 && this.readyState == 4) {
            // success
            alert(this.responseText);
        }
    }

    xhr.onerror = function() {
        alert('Something went wrong. Failed to save data.');
    }

    xhr.open('POST', '/update', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({
             id: parseInt(window.location.pathname.split('/')[1]),
            content_name: form.content_name.value,
            content: document.getElementById('content').innerHTML
    }));
    
    }
}
function saveas(e)
{
    e.preventDefault();
    var userData=JSON.parse(localStorage.getItem('userData') ||'{}');
            var filename=userData.filename;
    if(localStorage.getItem("userData")==null)
    {

      var filename=prompt("enter the filename","");
        if (filename==null || filename=="") {
            alert("plz enter the filename!!");
        }
        else{
         localStorage.setItem('userData', JSON.stringify({
                
                filename:filename
            }));
 
    let xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
        if(this.status == 200 && this.readyState == 4) {
            // success
            alert(this.responseText);
        }
    }
    xhr.onerror = function() {
        alert('Something went wrong. Failed to save data.');
    }
    xhr.open('POST', '/save-content', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({
        
        username:document.getElementById('user_name').innerHTML,
        content_name: filename,
        content: document.getElementById('content').innerHTML
    }));
    }
    }
    else
    {
        
         userData=JSON.parse(localStorage.getItem('userData') ||'{}');
            var fname=userData.filename;
        var filename=prompt("enter the filename",fname);
        if (filename==null || filename=="") {
            alert("plz enter the filename!!");
        }
        else{
         localStorage.setItem('userData', JSON.stringify({
                
                filename:filename
            }));
 
    let xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
        if(this.status == 200 && this.readyState == 4) {
            // success
            alert(this.responseText);
        }
    }
    xhr.onerror = function() {
        alert('Something went wrong. Failed to save data.');
    }
    xhr.open('POST', '/save-content', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({
        
        username:document.getElementById('user_name').innerHTML,
        content_name: filename,
        content: document.getElementById('content').innerHTML
    }));
    }

}
}
function copy(e)
{
    e.preventDefault();
     let xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
        if(this.status == 200 && this.readyState == 4) {
            // success
            alert(this.responseText);
        }
    }
    xhr.onerror = function() {
        alert('Something went wrong. Failed to save data.');
    }
    
     var userData=JSON.parse(localStorage.getItem('userData') ||'{}');
            var filename=userData.filename;
    xhr.open('POST', '/copy', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({
        
        username:document.getElementById('user_name').innerHTML,
        content_name: filename,
        content: document.getElementById('content').innerHTML
    }));
}
function rename(e)
{
    e.preventDefault();
    window.localStorage.clear();
   var filename=prompt("enter the new filename","");
    localStorage.setItem('userData', JSON.stringify({
                
                filename:filename
            }));
 
   let xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
        if(this.status == 200 && this.readyState == 4) {
            // success
            alert(this.responseText);
        }
    }
    xhr.onerror = function() {
        alert('Something went wrong. Failed to save data.');
    }
    xhr.open('POST', '/update2', true);
     var userData=JSON.parse(localStorage.getItem('userData') ||'{}');
            var filename=userData.filename;
           // console.log(rename);
       localStorage.getItem('filename');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({
             content_name:filename,
            content: document.getElementById('content').innerHTML
    }));  
}
function savelogin(e){
    e.preventDefault();
    let xhr= new XMLHttpRequest();
    xhr.onreadystatechange = function(){
        if(this.status ==200 && this.readyState ==4){
        
        let data=JSON.parse(this.responseText);
          if(data.code==1)
           {
           
             document.cookie = "username=" + data.username;
            window.location.href = '/editor';
           }
           else
           {
            alert(data.message);
           }
        }
    }
    xhr.onerror = function(){
        alert("error");
    }
     xhr.open('POST', '/auth-login',true);
     
     xhr.setRequestHeader('Content-Type','application/json');
    xhr.send(JSON.stringify({
        //userid:document.login.userid.value,
        username:document.login.username.value,
        password:document.login.password.value,
}));
}
function Forgot(e)
{
  
 e.preventDefault();
 var token=Math.floor((Math.random() *10000000)+54);

 document.cookie = "token=" +token;
 var email=document.forgot.email.value;
 document.cookie = "email=" +email;
    let xhr= new XMLHttpRequest();
    xhr.onreadystatechange = function(){
        if(this.status ==200 && this.readyState ==4){
        
        alert(this.responseText);
         xhr.onerror = function(){
        alert("error");
    }
  }
  }
     xhr.open('POST', '/forgot',true);
     
     xhr.setRequestHeader('Content-Type','application/json');
    xhr.send(JSON.stringify({
        email:document.forgot.email.value,
        token:token
}));
}

function delcookie()
{
      

   document.cookie="username=" ;
  window.localStorage.clear();
}

 function loadusername()

      {
   
            document.getElementById("user_name").innerHTML=Cookies.get('username'); 
           

           window.localStorage.clear();  
          }
function loaduserid2()

{
   
            document.getElementById('u_name').value=Cookies.get('username');
}
 function Sharefiles(id)
{
    var username=prompt("enter the username which user u want to share the file:","");
    var edit=confirm("if u give the permisstion to the user..to edit the file or not??");

     var userData=JSON.parse(localStorage.getItem('userData') ||'{}');
            var ownername=userData.username;
    if (username==null || username=="") {
        alert("plz enter the username");
    }
    else
    {
        let xhr= new XMLHttpRequest();
    xhr.onreadystatechange = function(){
        if(this.status ==200 && this.readyState ==4){
            alert(this.responseText);
        }
    }
    xhr.onerror = function(){
        alert("error");
    }
     xhr.open('POST', '/share-file',true);
     xhr.setRequestHeader('Content-Type','application/json');
    xhr.send(JSON.stringify({
       id:id,
       username:username,
       ownername:ownername,
       edit:edit
       
    }));
        }
}   
function savedata(e)
{
         e.preventDefault();
    let xhr= new XMLHttpRequest();
    xhr.onreadystatechange = function(){
        if(this.status ==200 && this.readyState ==4){
            alert(this.responseText);
             
            
            window.location.href='/editor';

        }
    }
    xhr.onerror = function(){
        alert("error");
    }
     xhr.open('POST', '/save-userdata',true);
     xhr.setRequestHeader('Content-Type','application/json');
    xhr.send(JSON.stringify({
        
        username:document.notepad.username.value,
        email:document.notepad.email.value,
        password:document.notepad.password.value
    }));

}
