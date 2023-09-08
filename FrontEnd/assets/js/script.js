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
    btn_cat[prevSelect].classList.remove("input--select");


    if(!cat){
        listWork = works;
        prevSelect = 0;
    }else{
        listWork = works.filter(work=>work.categoryId===cat);
        prevSelect = cat;
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

const reponseWorks = await fetch("http://localhost:5678/api/works");
const reponseCat = await fetch("http://localhost:5678/api/categories");
const works = await reponseWorks.json();
const categories = await reponseCat.json();

const bloc_projets = document.getElementById("bloc_projets");
const bloc_filter = document.getElementById("bloc_filter");
let btn_cat = [];
let prevSelect = 0;

await loadCat();
await loadWork(0);

btn_cat[0].addEventListener('click', function(){loadWork(0)});
btn_cat[1].addEventListener('click', function(){loadWork(1)});
btn_cat[2].addEventListener('click', function(){loadWork(2)});
btn_cat[3].addEventListener('click', function(){loadWork(3)});
