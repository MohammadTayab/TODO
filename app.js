import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut} from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js";
import { getFirestore, collection, addDoc,  onSnapshot, doc, deleteDoc, updateDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAeO3-Z4l74AHkcU8MHftg0dW5yxqMQiac",
  authDomain: "todo-bf97d.firebaseapp.com",
  databaseURL: "https://todo-bf97d-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "todo-bf97d",
  storageBucket: "todo-bf97d.appspot.com",
  messagingSenderId: "768549522637",
  appId: "1:768549522637:web:eca0b35baa27b8d1ef6d84",
  measurementId: "G-304PHPHZCK"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

let btn = document.querySelector('#subtn')

if (btn) {
  btn.addEventListener('click', async () => {
    let getemail = document.querySelector('#semail')
    let getpass = document.getElementById('spass')

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, getemail.value, getpass.value);
      const user = userCredential.user;
      const docRef = await addDoc(collection(db, "users"), {
        first: getemail.value,
        last: getpass.value,
      });
      console.log("Document written with ID: ", docRef.id);
      alert('Signup successful');
      location.href = './signin.html';
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log('error code ==> ', errorCode);
      console.log('error message ==> ', errorMessage);
    }
  });
}



let btn1 = document.querySelector('#sibtn')
if (btn1) {
  btn1.addEventListener('click', () => {
    let email = document.querySelector('#lemail')
    let password = document.getElementById('lpass')

    signInWithEmailAndPassword(auth, email.value, password.value)
      .then((userCredential) => {
        const user = userCredential.user;
        alert(`Login successful! Email: ${user.email}`);
        location.href = `./welcome.html?email=${user.email}`;
      })
      .catch((error) => {
        console.log(error)
      });
  });
}




let getBtn = document.querySelector('#show')
if (getBtn) {
  getBtn.addEventListener('click', async () => {
    const hashir = await getDocs(collection(db, "users"));
    let getDiv = document.getElementById('getusers')

    hashir.forEach((doc) => {
      getDiv.innerHTML += `
      <div>${doc.data().first}</div>
      <div>${doc.data().last}</div>
      `
   
    });
  })
}



window.addtodo = async function () {
    let getinp = document.querySelector('#getinp')
    const docRef = await addDoc(collection(db, "todos"), {
        name: getinp.value,
        time: new Date().toLocaleString()
    });
    console.log("Document written with ID: ", docRef.id);
}


function getData() {
    let ul = document.querySelector('#getul')
    onSnapshot(collection(db, 'todos'), (data) => {
        data.docChanges().forEach((newData) => {

            if (newData.type == 'removed') {
                let del = document.getElementById(newData.doc.id)
                del.remove()
            }
            else if(newData.type == 'added') {
                ul.innerHTML += `
                            <li id=${newData.doc.id}>${newData.doc.data().name} <br> ${newData.doc.data().time}  <button class="green" onclick="edit(this,'${newData.doc.id}')">Edit</button> <button class="delete-button" onclick="delTodo('${newData.doc.id}')">Delete</button></li>
                            `

            }
           

        })
    })
}

getData()

async function delTodo(id) {
    await deleteDoc(doc(db, "todos", id));
}


async function edit(e,id) {
    let editval = prompt('Enter Edit value')

    e.parentNode.firstChild.nodeValue = editval

    await updateDoc(doc(db, "todos", id), {
        name: editval,
        time: new Date().toLocaleString()
    });
}


async function delAllTodos() {
    const todosCollection = collection(db, 'todos');
    const todosSnapshot = await getDocs(todosCollection);

    todosSnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
    });

    list.innerHTML = "";
}



window.getData = getData
window.delTodo = delTodo
window.edit = edit
window.delAllTodos = delAllTodos



let logoutBtn = document.querySelector('#logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
        try {
            await signOut(auth);
            alert('Logout successful');
            location.href = './signin.html';
        } catch (error) {
            console.error('Logout error:', error);
        }
    });
}