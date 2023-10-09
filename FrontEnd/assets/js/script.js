/* fonction création template HTML */
function CreateObjectHtml(html){
	const template = document.createElement("template");

	template.innerHTML = html.trim();

	return template.content.firstElementChild;
}

/* fonction verifier si connecter
    <= retourne une valeur si connecter */
function checkLogin(){
    if(localStorage.getItem('authTK'))
        return 1;
    else
        return null;
}

/* fonction de déconnexion */
function deco(){
    localStorage.clear();
}

/* fonction rafraichir la liste des travaux */
async function refreshWork(){
    return (await fetch("http://localhost:5678/api/works")).json();
}

/* fonction afficher les travaux
    => Selon la catégorie */
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

/* fonction remise à zéro affichage des projets */
function cleanWork(){
    bloc_projets.innerHTML ='';
}

/* fonction afficher les choix de catégories */
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

/* fonction afficher la liste des travaux et pouvoir les supprimer */
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

    loadCatForm();
}

/* fonction suppression de projet 
    => selon l'ID du projet */
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

/* fonction récupérer liste catégorie pour le dropdown */
function loadCatForm(){
    let tempHTML;
    file_cat.innerHTML = '';
    categories.forEach(b => {
        tempHTML = CreateObjectHtml(`
            <option 
                value="${b.id}" 
            >
                ${b.name}
            </option>
        `);

        file_cat.insertAdjacentElement('beforeend',tempHTML);
    });
}

/* fonction afficher l'image chargé pour l'ajout de projet */
function Out_file_show(){
    
    if(tempFile){
        bloc_show_add_photo.style.display = "none";

        let tempHTML;
        file_out.innerHTML='';
        tempHTML = CreateObjectHtml(`
            <div 
                class="img_out" 
            >
                <img src="${URL.createObjectURL(tempFile)}">
                <span id="out_change">changer</span>
            </div>
        `);

        file_out.insertAdjacentElement('beforeend', tempHTML);
        tempEventOut = document.getElementById("out_change");
        tempEventOut.addEventListener('click', function(){Out_file_deleted()});

        if(file_titre.value){
            file_envoyer.style.backgroundColor = "#1D6154";
        }
    }
    else{
        bloc_show_add_photo.style.display = "block";
        file_out.innerHTML='';
        file_envoyer.style.backgroundColor = "#A7A7A7";
    }
}

/* fonction pour annuler l'image ajouter pour le projet */
function Out_file_deleted(){
    tempFile=null;
    Out_file_show();
}

/* fonction ajouter un projet */
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
            sup_works.style.display = "block";
            add_works.style.display = "none";
            retour.style.display = "none";
            tempFile=null;
            file_titre.value = '';
        }else{
            console.error(rep.status + ' => ' + rep.statusText);
        }
    } catch (e){
        console.error('ERREUR => ', e);
    }
}



/* variables */
    /* log */
    const login = document.getElementById("login");
    /* api */
    let works = await refreshWork();
    const reponseCat = await fetch("http://localhost:5678/api/categories");
    const categories = await reponseCat.json();
    /* bloc ID */
        /* header */
        const bloc_header = document.getElementById("header");
        /* => filter */
        const bloc_filter = document.getElementById("bloc_filter");
        /* => portfolio */
        const bloc_porfolio = document.getElementById("portfolio");
        const bloc_projets = document.getElementById("bloc_projets");
        /* => modal */
        const modal = document.getElementById("Modal");
        const close_modal = document.getElementById("close");
        const modal_works = document.getElementById("modal_works");
        const sup_works = document.getElementById("modal_supr");
        const add_works = document.getElementById("modal_form");
        const add_works_photo = document.getElementById("add_works");
        const retour = document.getElementById("rtr");
        const file = document.getElementById("fichier");
        const file_titre = document.getElementById("titre");
        const file_cat = document.getElementById("cat");
        const file_envoyer = document.getElementById("envoyer");
        const file_out = document.getElementById("out_file"); 
        const bloc_show_add_photo = document.getElementById("bloc_show_add_photo"); 
    /* temp / utilitaire */
    let tempFile;
    let tempEventOut;
    let prevSelect = 0;
    /* tableaux */
    let btn_cat = [];
    let btn_supr = [];

/* initialisation */
    loadCat();
    loadWork(0);

/* listener */
    /* filtre */
    for(let i=0;i<btn_cat.length;i++){
        btn_cat[i].addEventListener('click', function(){loadWork(i)});
    }
    /* modal */
    file_envoyer.addEventListener('click', function(){addWork()});

    file.addEventListener("change", () => {
        tempFile=file.files[0];
        Out_file_show();
    });

    close_modal.addEventListener('click', function(){modal.style.display = "none"});

    retour.addEventListener('click', function(){
        sup_works.style.display = "block";
        add_works.style.display = "none";
        retour.style.display = "none"
    });

    add_works_photo.addEventListener('click', function(){
        sup_works.style.display = "none";
        add_works.style.display = "block";
        retour.style.display = "inline-block"
    });

    file_titre.addEventListener("change", () => {
        if(file_titre.value && tempFile){
            file_envoyer.style.backgroundColor = "#1D6154";
        }else{
            file_envoyer.style.backgroundColor = "#A7A7A7";
        }
    });
    
/* condition */
    if(checkLogin()){
        console.log("connecté");
        await loadModal();

        login.innerHTML ='<a href=".">logout</a>';
        login.addEventListener('click', function(){deco()});

        bloc_filter.style.display = "none";

        bloc_header.insertAdjacentElement('beforeend',
        CreateObjectHtml(`
        <div class="mode_edit">
            <i class="fa-regular fa-pen-to-square"></i>
            <p>
                Mode édition
            </p>
        </div>
        `)).addEventListener('click', function(){modal.style.display = "block"});

        bloc_porfolio.children[0].insertAdjacentElement('afterend',
        CreateObjectHtml(`
        <div id="mode_edit_prjct">
                <i class="fa-regular fa-pen-to-square"></i>
                <p>
                    modifier
                </p>
        </div>
        `)).addEventListener('click', function(){modal.style.display = "block"});
    }
    else{
        console.log("non connecté");
    }


