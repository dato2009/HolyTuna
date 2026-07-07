const feedContainer = document.querySelector('.blog-feed');

fetch('/scripts/data.json')
    .then(response => response.json())
    .then(blogPosts => {
        

        blogPosts.reverse();

  

        blogPosts.forEach(post => {
            const cardElement = document.createElement('div');
            cardElement.classList.add('users');

            const title = document.createElement('h1');
            title.textContent = post.headline;

            const body = document.createElement("p");
            body.textContent = post.text;

            const timeOfPost = document.createElement("p");
            timeOfPost.classList.add('post-time');
            timeOfPost.textContent = post.timeofpost;

            cardElement.appendChild(title);     
            cardElement.appendChild(body);
            cardElement.appendChild(timeOfPost);
            
            feedContainer.appendChild(cardElement);
        });
    })
    .catch(err => console.error("Could not construct dynamic blog components:", err));

function dropdown(name) {
    var target = document.getElementById(name);
    var dropdowns = document.getElementsByClassName("dropdown-content");

    for (var i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown !== target && openDropdown.classList.contains('show')) {
            openDropdown.classList.remove('show');
        }
    }
    target.classList.toggle("show");
}

window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        for (var i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}