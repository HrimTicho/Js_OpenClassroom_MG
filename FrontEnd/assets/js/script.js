function CreateObjectHtml(html){
	const template = document.createElement("template");

	template.innerHTML = html.trim();

	return template.content.firstElementChild;
}



function cleanWork(){
    bloc_projets.innerHTML ='';
}

function loadWork(cat){
    let listWork;

    cleanWork();

    if(!cat){
        listWork = works;
    }else{
        listWork = works.filter(work=>work.categoryId===cat);
    }

    listWork.forEach(b => {
        const travaux = CreateObjectHtml(`
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
    
        bloc_projets.insertAdjacentElement('beforeend',travaux);
    });
}



const reponseWorks = await fetch("http://localhost:5678/api/works");
const reponseCat = await fetch("http://localhost:5678/api/categories");
const works = await reponseWorks.json();
const categories = await reponseCat.json();

const bloc_projets = document.getElementById("bloc_projets");

//let travaux = new Array;



loadWork(0);

