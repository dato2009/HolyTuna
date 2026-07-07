function toggleDropdown(name) {
  const target = document.getElementById(name);
  const dropdowns = document.getElementsByClassName("dropdown-content");
  
  for (let i = 0; i < dropdowns.length; i++) {
    const openDropdown = dropdowns[i];
    if (openDropdown !== target && openDropdown.classList.contains('show')) {
      openDropdown.classList.remove('show');
    }
  }
  target.classList.toggle("show");
}

window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {
    const dropdowns = document.getElementsByClassName("dropdown-content");
    for (let i = 0; i < dropdowns.length; i++) {
      const openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}

document.querySelectorAll(".carousel").forEach(carousel => {
  const track = carousel.querySelector(".carousel__track");
  const slides = carousel.querySelectorAll(".carousel__slide");
  const prevBtn = carousel.querySelector(".carousel__btn--prev");
  const nextBtn = carousel.querySelector(".carousel__btn--next");
  const nav = carousel.querySelector(".carousel__nav");

  let index = 0;

  slides.forEach((_, i) => {
    const dot = document.createElement("span");
    dot.classList.add("carousel__dot");
    if (i === 0) dot.classList.add("active");

    dot.addEventListener("click", () => {
      index = i;
      update();
    });
    nav.appendChild(dot);
  });

  const dots = nav.querySelectorAll(".carousel__dot");

  function update() {
    track.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach(d => d.classList.remove("active"));
    dots[index].classList.add("active");
  }

  nextBtn.addEventListener("click", () => {
    index = (index + 1) % slides.length;
    update();
  });

  prevBtn.addEventListener("click", () => {
    index = (index - 1 + slides.length) % slides.length;
    update();
  });
});

const shopFeat = document.querySelector(".Featured-shop-items");

if (shopFeat) {
  fetch('/scripts/shopitems.json')
    .then(response => response.json())
    .then(data => {
      data.forEach((stuff, index) => {
        if (index < 8) { 
          displayItem(stuff);
        }
      });
    })
    .catch(err => console.error("Error structuralizing marketplace elements:", err));
}

function displayItem(item) {
  const itemDiv = document.createElement('div');
  itemDiv.classList.add('box');
  itemDiv.setAttribute('id', item.name);

  const itemName = document.createElement('h3');
  const itemPrice = document.createElement('p');
  const itemCount = document.createElement('p');
  const button = document.createElement('button');

  itemCount.setAttribute("class", "stock");
  itemName.textContent = item.name;
  itemPrice.textContent = "Price: $" + item.price;
  itemCount.textContent = "Available Stock: " + item.count;
  button.textContent = "Check Shop";

  itemDiv.appendChild(itemName);
  itemDiv.appendChild(itemPrice);
  itemDiv.appendChild(itemCount);
  itemDiv.appendChild(button);
  
  shopFeat.appendChild(itemDiv);

  button.addEventListener('click', () => {
    window.location.href = "/pages/post-your-content/shop.html";
  });
}

const blogsFeat = document.querySelector(".Featured-Blogs");

if (blogsFeat) {
  fetch('/scripts/data.json')
    .then(response => response.json())
    .then(data => {
   
      data.slice(-4).reverse().forEach(dataItem => {
        const posts = document.createElement('div');
        const title = document.createElement('h3');
        const body = document.createElement("p");
        const timeofpost = document.createElement("p");
        
        posts.classList.add('users');

        title.textContent = dataItem.headline;
        body.textContent = dataItem.text;
        timeofpost.textContent = dataItem.timeofpost;

        posts.appendChild(title);     
        posts.appendChild(body);
        posts.appendChild(timeofpost);
        
        blogsFeat.appendChild(posts);
      });
    })
  
}