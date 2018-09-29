AJAX = {
    get: (action, queries) => {
        return new Promise((resolve, reject) => {
            let qString = [];

            queries = queries || {};
            for(let q in queries) {
                qString.push(q + '=' + queries[q]);
            }

            var url = action + '?' + qString.join('&');

            var xhr = new XMLHttpRequest();

            xhr.onreadystatechange = function() {
                if(this.readyState == 4 && this.status == 200) {
                    resolve(JSON.parse(this.responseText));
                }
            }

            xhr.onerror = reject;
            xhr.open('GET', url, true);
            xhr.send();
        });
    },

    post: (action, data) => {
        return new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest();

            xhr.onreadystatechange = function() {
                if(this.readyState == 4 && this.status == 200) {
                    resolve(JSON.parse(this.responseText));
                }
            }

            xhr.onerror = reject;
            xhr.open('POST', action, true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send(JSON.stringify(data));
        });
    }
}