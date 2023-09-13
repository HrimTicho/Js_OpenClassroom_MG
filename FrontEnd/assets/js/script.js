function CreateObjectHtml(html){
	const template = document.createElement("template");

	template.innerHTML = html.trim();

	return template.content.firstElementChild;
}

function cleanWork(){
    bloc_projets.innerHTML ='';
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

function loadCat(){
    let i=0;
    let tempHTML;

    tempHTML = CreateObjectHtml(`
        <input 
            type="button" 
            value="Tous" 
            id="btn_cat_${i}"
            class="input_filter"
        >
    `);

    bloc_filter.insertAdjacentElement('beforeend', tempHTML);
    btn_cat.push(document.getElementById(`btn_cat_${i}`));

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
        btn_cat.push(document.getElementById(`btn_cat_${i}`));
    });
}

function checkLogin(){
    if(sessionStorage.getItem('authTK'))
        return 1;
    else
        return null;
}

function loadModal(){
    modal_works.innerHTML ='';

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
}

async function deleteWork(_id){
    const id = parseInt(_id.replace("id_", ""));
    console.log(`delete => ${id}`);

    try{
        const rep = await fetch(`http://localhost:5678/api/works/${id}`, {
        method: 'DELETE',
        headers: {
            Accept : 'application/json',
            'Content-Type':'application/json',
            'Authorization': 'Bearer ' + sessionStorage.getItem('authTK')
        },
    })

        if(rep.ok){
            /*await loadWork(0);
            await loadModal();*/

        }else{
            console.error(rep.status + ' => ' + rep.statusText);
        }
    } catch (e){
        console.error('ERREUR => ', e);
    }
}

const reponseWorks = await fetch("http://localhost:5678/api/works");
const reponseCat = await fetch("http://localhost:5678/api/categories");
const works = await reponseWorks.json();
const categories = await reponseCat.json();

const bloc_projets = document.getElementById("bloc_projets");
const bloc_filter = document.getElementById("bloc_filter");
const bloc_header = document.getElementById("header");
const modal = document.getElementById("Modal");
const close_modal = document.getElementById("close");
const modal_works = document.getElementById("modal_works");

let btn_cat = [];
let btn_supr = [];
let prevSelect = 0;

await loadCat();
await loadWork(0);

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

    for(let i=0;i<btn_supr.length;i++){
        btn_supr[i].addEventListener('click', function(){deleteWork(btn_supr[i].getAttribute('id'))});
    }
}
else
    console.log("non connecté");
