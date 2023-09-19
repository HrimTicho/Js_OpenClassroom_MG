function CreateObjectHtml(html){
	const template = document.createElement("template");

	template.innerHTML = html.trim();

	return template.content.firstElementChild;
}

function cleanWork(){
    bloc_projets.innerHTML ='';
}

async function refreshWork(){
    return (await fetch("http://localhost:5678/api/works")).json();
}

function loadWork(_cat){
    let listWork;

    cleanWork();
    btn_cat[prevSelect].classList.remove("input--select");


    if(!_cat){
        listWork = works;
        prevSelect = 0;
    }else{
        listWork = works.filter(work=>work.categoryId===_cat);
        prevSelect = _cat;
    }

    btn_cat[prevSelect].classList.add("input--select");

    listWork.forEach(b => {
        bloc_projets.insertAdjacentElement('beforeend',
            CreateObjectHtml(`
                <figure>
                    <img 
                        src="${ b.imageUrl }" 
                        alt="${ b.title }"
                    >
                    <figcaption>
                    ${ b.title }
                    </figcaption>
                </figure>
            `)
        );
    });
}

//simplifier MAP
function loadCat(){
    let i=0;
    let tempHTML;
    let btn;

    tempHTML = CreateObjectHtml(`
        <input 
            type="button" 
            value="Tous" 
            id="btn_cat_${i}"
            class="input_filter"
        >
    `);

    bloc_filter.insertAdjacentElement('beforeend', tempHTML);
    btn = document.getElementById(`btn_cat_${i}`);

    btn_cat.push(btn);

    categories.forEach(b => {
        i++;

        tempHTML = CreateObjectHtml(`
            <input 
                type="button" 
                value="${b.name}" 
                id="btn_cat_${i}"
                class="input_filter"
            >
        `);

        bloc_filter.insertAdjacentElement('beforeend',tempHTML);
        btn = document.getElementById(`btn_cat_${i}`);

        btn_cat.push(btn);
    });
}

function checkLogin(){
    if(localStorage.getItem('authTK'))
        return 1;
    else
        return null;
}

function loadModal(){
    modal_works.innerHTML ='';
    btn_supr = [];
    works.forEach(b => {
        modal_works.insertAdjacentElement('beforeend',
            CreateObjectHtml(`
                <figure>
                    <img 
                        src="${ b.imageUrl }" 
                        alt="${ b.title }"
                    >
                    <figcaption>
                        <i 
                            class="fa-regular fa-trash-can fa-2xs" 
                            id="id_${b.id}"
                        ></i>
                    </figcaption>
                </figure>
            `)
        );

        btn_supr.push(document.getElementById(`id_${b.id}`));
    });

    for(let i=0;i<btn_supr.length;i++){
        btn_supr[i].addEventListener('click', function(){deleteWork(btn_supr[i].getAttribute('id'))});
    }
}

async function deleteWork(_id){
    const id = parseInt(_id.replace("id_", ""));

    try{
        const rep = await fetch(`http://localhost:5678/api/works/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type':'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('authTK')
            },
        })
        if(rep.ok){
            works = await refreshWork();
            loadWork(0);
            loadModal();

        }else{
            console.error(rep.status + ' => ' + rep.statusText);
        }
    } catch (e){
        console.error('ERREUR => ', e);
    }
}

async function addWork(){
    const data = new FormData();

    data.append('image', file.files[0]);
    data.append('title', file_titre.value);
    data.append('category', file_cat.value);

    try{
        const rep = await fetch(`http://localhost:5678/api/works`, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('authTK')
            },
            body: data
        })
        if(rep.ok){
            works = await refreshWork();
            await loadWork(0);
            loadModal();

        }else{
            console.error(rep.status + ' => ' + rep.statusText);
        }
    } catch (e){
        console.error('ERREUR => ', e);
    }
}


let works = await refreshWork();
const reponseCat = await fetch("http://localhost:5678/api/categories");
const categories = await reponseCat.json();

const bloc_projets = document.getElementById("bloc_projets");
const bloc_filter = document.getElementById("bloc_filter");
const bloc_header = document.getElementById("header");
const modal = document.getElementById("Modal");
const close_modal = document.getElementById("close");
const modal_works = document.getElementById("modal_works");

const file = document.getElementById("fichier");
const file_titre = document.getElementById("titre");
const file_cat = document.getElementById("cat");
const file_envoyer = document.getElementById("envoyer");

file_envoyer.addEventListener('click', function(){addWork()});

let btn_cat = [];
let btn_supr = [];
let prevSelect = 0;

loadCat();
await loadWork(0);

//a faire
btn_cat[0].addEventListener('click', function(){loadWork(0)});
btn_cat[1].addEventListener('click', function(){loadWork(1)});
btn_cat[2].addEventListener('click', function(){loadWork(2)});
btn_cat[3].addEventListener('click', function(){loadWork(3)});

close_modal.addEventListener('click', function(){modal.style.display = "none"});


if(checkLogin()){
    console.log("connecté");
    await loadModal();

    bloc_header.insertAdjacentElement('beforeend',
    CreateObjectHtml(`
    <div class="mode_edit">
        <i class="fa-regular fa-pen-to-square"></i>
        <p>
            Mode édition
        </p>
    </div>
    `)).addEventListener('click', function(){modal.style.display = "block"});
}
else
    console.log("non connecté");


