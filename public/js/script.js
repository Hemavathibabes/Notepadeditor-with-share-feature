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
        
        user_id:form.user_id.value,
        content_name: form.content_name.value,
        content: document.getElementById('content').innerHTML
    }));
    
    } else {

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


function savelogin(e){
    e.preventDefault();
    let xhr= new XMLHttpRequest();
    xhr.onreadystatechange = function(){
        if(this.status ==200 && this.readyState ==4){
            //alert(this.responseText);
        let data=JSON.parse(this.responseText);
           if(data.code==1)
           {
            //alert("WELCOME....."   + data.username);
            localStorage.setItem('userData', JSON.stringify({
                userid: data.userid,
                username: data.username
            }));
             //window.location.href="/saving";
             document.cookie = "userId=" + data.userid;
            window.location.href = '/editor';
    //        }
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
     //xhr.open('GET','/saving',true);
     xhr.setRequestHeader('Content-Type','application/json');
    xhr.send(JSON.stringify({
        userid:document.login.userid.value,
       // username:document..username.value,
        password:document.login.password.value,

       
    }));
//   xhr.open('POST','/saving',true);
//   xhr.setRequestHeader("Content-Type",'text/ejs');
}
function loaduserid()

{
    var userData=JSON.parse(localStorage.getItem('userData') ||'{}');
            var userid=userData.userid;
            var username=userData.username;
            document.getElementById("user_name").innerHTML=username;
            document.getElementById('user_id').value=userid;
}


function loaduserid2()

{
    var userData=JSON.parse(localStorage.getItem('userData') ||'{}');
            var userid=userData.userid;
            document.getElementById('u_id').value=userid;
}
 function Sharefiles(id)
{
    var userid=prompt("enter the userid which user u want to share the file:","");
    var edit=confirm("if u give the permisstion to the user..to edit the file or not??");

     var userData=JSON.parse(localStorage.getItem('userData') ||'{}');
            var ownerid=userData.userid;
    if (userid==null || userid=="") {
        alert("plz enter the userid");
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
       userid:userid,
       ownerid:ownerid,
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
            window.location.href='/';
        }
    }
    xhr.onerror = function(){
        alert("error");
    }
     xhr.open('POST', '/save-userdata',true);
     xhr.setRequestHeader('Content-Type','application/json');
    xhr.send(JSON.stringify({
        userid:document.notepad.userid.value,
        username:document.notepad.username.value,
        password:document.notepad.password.value
    }));

}
