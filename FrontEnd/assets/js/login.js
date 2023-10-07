localStorage.clear();

const logInBtn = document.getElementById('btn_log_in');
const mail = document.getElementById('mail');
const mdp = document.getElementById('mdp');
const error = document.getElementById('error');

logInBtn.addEventListener('click', async()=>{
    try{
        const rep = await fetch('http://localhost:5678/api/users/login', {
            method: 'POST',
            headers: {
                'Accept' : 'application/json',
                'Content-Type':'application/json',
            },
            body: JSON.stringify({
                "email": mail.value,
                "password": mdp.value,
            })
        })

        if(rep.ok){
            const key = await rep.json();

            localStorage.setItem('authTK', key.token);

            window.location.href = '../../index.html';
        }else{
            error.insertAdjacentHTML('beforeBegin',`<div class="error_log">
                <i class="fa-solid fa-circle-exclamation"></i>
                <span>Erreur dans l'identifiant ou le mot de passe</span>
            </div>`);
        }
    } catch (e){
        console.error('ERREUR => ', e);
    }
});