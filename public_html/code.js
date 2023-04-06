
/*Name: Yazid Boufous
This is the code file for PA10 of CSC337. This is the client side responsible for sending different requests and displaying the results.*/

function createAccount(){

    let user = document.getElementById('username2').value;
    let pswrd = document.getElementById('password2').value;

    let url = '/create/account/';
    let data = { username: user, password: pswrd};

    let p = fetch(url, {
      method: 'POST', 
      body: JSON.stringify(data),
      headers: {"Content-Type": "application/json"}
    });

    p.then((response) => {
        return response.text();
    })

    .then((text)=>{
        if  (text=="Created"){
            alert("Account Created");
        }

        else{
            alert("Username already taken");
        }
    })

    .catch((err) => { 
        console.log('Something went wrong',err);
    });

}


function login(){

    let user=document.getElementById('username1').value;
    let pswrd =document.getElementById('password1').value;

    let url = '/log/user/';
    let data = { username: user, password: pswrd};

    let p = fetch(url, {
      method: 'POST', 
      body: JSON.stringify(data),
      headers: {"Content-Type": "application/json"}
    });

    p.then((response) => {
        return response.text();
    })

    .then((text) =>{

        if (x[0]=="login"){
            window.location.href='/home.html';  
            console.log(x[1]);
            // document.getElementById("wuser").innerText=
       }

        else{
            alert("account does not exist");
        }
    })

    .catch((err) => { 
        console.log('something went wrong',err);
        window.location.href='/home.html';    

    });

}


function createListing(){
    window.location.href='/post.html';    
}

function redirect(){
    window.location.href='/home.html';    

}
function createPost(){

    
    let itemTitle = document.getElementById('title').value;
    let desc = document.getElementById('desc').value;
    let img = document.getElementById('image').value;
    let itemPrice = document.getElementById('price').value;
    let status=document.getElementById('status').value;

    let url = '/create/post';

    let data = { title:itemTitle , description:desc, image:img, price:itemPrice, stat:status} ;

    let p = fetch(url, {
      method: 'POST', 
      body: JSON.stringify(data),
      headers: {"Content-Type": "application/json"}
    });

    p.then(() => {
        console.log("sucess");
    });

    p.catch((err) => { 
        console.log(err);
    });

  
}


function getListings(){

    url="/get/listings";


    let p=fetch(url);

    p.then( (response)=>{
        return response.json();
    })
    .then( (data)=>{

        var container = document.getElementById("display");
        container.innerHTML = ""; // clear the chat div

        for (var i=0; i<data.length; i++) {

            var new_div = document.createElement("div");
            new_div.className="newdiv";
    
            var title= document.createElement("div");
            title.className="title";
            title.innerHTML= data[i].title;

            var desc= document.createElement("div");
            desc.className="description";
            desc.innerHTML= "Description:"+ data[i].description;


            var price= document.createElement("div");
            price.className="price";
            price.innerHTML= "Price:"+ data[i].price;

            var stat= document.createElement("div");
            stat.className="status";
            stat.innerHTML= "SALE";


            new_div.appendChild(title);
            new_div.appendChild(desc);
            new_div.appendChild(price);
            new_div.appendChild(stat);
            container.appendChild(new_div);
    
        }
    });
}



function getPurchases(){

    url="/get/purchases";

    let p=fetch(url);

    p.then( (response)=>{
        console.log(response);
        return response.json();
    })


    .then( (data)=>{


        var container = document.getElementById("display");
        container.innerHTML = ""; // clear the chat div

        for (var i=0; i<data.length; i++) {

            var new_div = document.createElement("div");
            new_div.className="newdiv";
    
            var title= document.createElement("div");
            title.className="title";
            title.innerHTML= data[i].title;

            var desc= document.createElement("div");
            desc.className="description";
            desc.innerHTML= "Description:"+ data[i].description;


            var price= document.createElement("div");
            price.className="price";
            price.innerHTML= "Price:"+ data[i].price;


            var stat= document.createElement("div");
            stat.className="status";
            stat.innerHTML= "SOLD";


            new_div.appendChild(title);
            new_div.appendChild(desc);
            new_div.appendChild(price);
            new_div.appendChild(stat);
            container.appendChild(new_div);
    
        }
    })

    .catch( (err) => {
        console.log("Something went wrong",err);
    });
        
};
    

function searchItems(){

    keyword= document.getElementById("search").value;

    url="/search/items/"+keyword;


    let p=fetch(url);

    p.then( (response)=>{
        return response.json();
    })

    .then( (data)=>{
                       
        var container = document.getElementById("display");
        container.innerHTML = ""; // clear the chat div

        for (var i=0; i<data.length; i++) {

            console.log(data[i]);

            var new_div = document.createElement("div");
            new_div.className="newdiv";
    
            var title= document.createElement("div");
            title.className="title";
            title.innerHTML= data[i].title;

            var desc= document.createElement("div");
            desc.className="description";
            desc.innerHTML= "Description:"+ data[i].description;

            var price= document.createElement("div");
            price.className="price";
            price.innerHTML= "Price:"+ data[i].price;

            var button= document.createElement("div");
            button.className="status";

            let item_id=data[i]._id;

            button.addEventListener('click', handleClick.bind(null, item_id));
                

            let status= data[i].stat;

            if (status=='sale'){
                    button.innerHTML="BUY Now!";
            }

            else{
                button.innerHTML='This item has already been sold';
            }

                
            new_div.appendChild(title);
            new_div.appendChild(desc);
            new_div.appendChild(price);
            new_div.appendChild(button);
            container.appendChild(new_div);


    
        }
    })
    .catch( (error) => {
        console.error('error:', error)
    });
}


function handleClick(item_id) {


    let data = { _id: item_id};

    let url="/add/purchase";

    let p = fetch(url, {
      method: 'POST', 
      body: JSON.stringify(data),
      headers: {"Content-Type": "application/json"}
    })
    .then(()=> {
        console.log("done");
        })
     .catch(function(error) {
            console.log(err);
        });
}




