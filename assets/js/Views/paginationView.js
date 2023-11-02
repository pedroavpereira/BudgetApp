const parentElement = document.querySelector(".pagination-container");

const generateMarkup = (data) =>{
    console.log(data)
    return `
    <button class="pagination-arrow ${data.page === 1 ? "hidden" : ""}" data-goto="${data.page -1}"><i class="pagination-arrow__icon bi bi-arrow-left"></i></button>
    <p class="pagination-info ">Page: <span class="pagination-current__Page">${data.page}</span>/<span class="pagination-number__Pages">${data.maxPages}</span></p>
    <button class="pagination-arrow  ${data.page === data.maxPages ? "hidden" : ""}" data-goto="${data.page + 1}"><i class="pagination-arrow__icon bi bi-arrow-right"></i></button> 
  </div>
  `
}

export const renderPagination = (data) =>{
    parentElement.innerHTML = generateMarkup(data);
}

export const paginationEvent = (handler) =>{
    parentElement.addEventListener("click",function(e){
        const target = e.target.closest(".pagination-arrow");
        if(!target) return
        handler(+target.dataset.goto);
    })
}

