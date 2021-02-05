// ==UserScript==
// @name         QAPass
// @namespace    http://qapass.codecons.com/
// @version      1.0
// @description  Manage and share passwords as plaintext!
// @author       Kristijan Novoselic
// @match        https://*.glooko.com/users/sign_in*
// @match        http://*.my.localtest.me:3000/users/sign_in*
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @grant        GM.xmlHttpRequest
// ==/UserScript==

const css = `
#qapass-container {
  transition: all .5s;
  position: absolute;
  right: 30px;
  top: 30px;
  min-width: 400px;

  background-color: #fff;
  padding: 0px 0 10px 0;
  border-radius: 8px;
  box-shadow: 1px 2px 2px 0 rgba(0,0,0,0.2);
  /*animation: qapass-scalein ease 0.5s;*/
}

@keyframes qapass-scalein {
  from { transform: scale(0.9); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

#qapass-container.qapass-hidden {
  transform: scale(0.9); opacity: 0;
}

#qapass-container .qapass-spinner:before {
  content: '';
  box-sizing: border-box;
  position: absolute;
  top: 50%;
  left: 50%;
  width: 20px;
  height: 20px;
  margin-top: -10px;
  margin-left: -10px;
  border-radius: 50%;
  border: 2px solid transparent;
  border-top-color: #fff;
  border-bottom-color: #fff;
  animation: qapass-spinner .8s cubic-bezier(0.51, -0.93, 0.64, 2.06) infinite;
}

@keyframes qapass-spinner {
  to {transform: rotate(360deg);}
}

#qapass-container > .qapass-header {
  border-bottom: 1px solid #dadce0;
}

#qapass-container > .qapass-header .qapass-title {
  display: flex;
  align-items: center;
  padding: 0 16px;
}

#qapass-container > .qapass-header .qapass-logo {
  height: 32px;
  margin-right: 12px;
}

#qapass-container > .qapass-header .qapass-close {
  height: 24px;
  margin-left: 4px;
  padding: 12px;
  position: relative;
  outline: none;
  transition: all .5s;
}

#qapass-container > .qapass-header .qapass-close:hover {
  background-color: rgb(32 33 36 / 0.1);
  border-radius: 50%;
  cursor: pointer;
}

#qapass-container > .qapass-header .qapass-close svg {
  width: 24px;
  height: 24px;
  position: relative;
}

#qapass-container > .qapass-header .qapass-logo svg {
  width: 32px;
  height: 32px;
}

#qapass-container > .qapass-header h1 {
  font-family: Lato, Helvetica, Arial, "Lucida Grande", sans-serif;
  font-weight: 500;
  font-size: 20px;
  letter-spacing: .25px;
  margin: 0;
  padding: 8px 0 0 0;
  text-align: left;
  color: #313131;
  flex-grow: 1;
}

#qapass-container > .qapass-account-list {
  max-height: 700px;
  overflow: auto;
}

#qapass-container > .qapass-account-list > .qapass-account:not(:last-child) {
  border-bottom: 1px solid #dadce0;
}

#qapass-container > .qapass-account-list > .qapass-account {
  padding: 5px 16px;
  transition: all .5s;
  display: flex;
  align-items: center;
}

#qapass-container > .qapass-account-list > .qapass-account-no-results {
  padding: 12px 16px 0 16px;
  text-align: center;
  font-weight: 500;
}

#qapass-container > .qapass-account-list > .qapass-account:hover {
  background-color: #e8f0fe;
}

#qapass-container > .qapass-account-list > .qapass-account > .qapass-account-info {
  flex-grow: 1;
}

#qapass-container > .qapass-account-list > .qapass-account > .qapass-account-login {
  padding: 10px;
  border-radius: 10px;
  background-color: #00BDFC;
  color: #fff;
  position: relative;
}

#qapass-container > .qapass-account-list > .qapass-account > .qapass-account-login.qapass-account-login-spinner {
  color: transparent;
}

#qapass-container > .qapass-account-list > .qapass-account > .qapass-account-login:hover {
  background-color: #469EF3;
  transition: background-color .5s;
  cursor: pointer;
}

#qapass-container > .qapass-account-list > .qapass-account > .qapass-account-info > .qapass-username {
  font-weight: 500;
}

#qapass-container > .qapass-account-list > .qapass-account > .qapass-account-info > .qapass-password {
  font-family: monospace;
}
`;

const html = `
<div class="qapass-header">
  <div class="qapass-title">
    <div class="qapass-logo">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><text x="0" y="14">🦄</text></svg>
    </div>
    <h1>Matching accounts</h1>
    <div class="qapass-close" role="button" aria-label="Close" tabindex="0"><svg class="Bz112c Bz112c-r9oPif" xmlns="https://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#5f6368"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path><path fill="none" d="M0 0h24v24H0z"></path></svg></div>
  </div>
</div>
<div class="qapass-account-list">
</div>
`;

GM_config.init(
{
  'id': 'MainConfig',
  'title': 'QAPass settings',
  'fields':
  {
    'ApiKey':
    {
      'label': 'API Key',
      'type': 'text'
    },
    'ApiSecret':
    {
      'label': 'API Secret',
      'type': 'text'
    }
  },
  'events': {
      'open': function(document, window, frame) {
          frame.style.width = "500px";
          frame.style.height = "200px";
      }
  }
});

GM_registerMenuCommand('Configuration', () => { GM_config.open() });

function fetchAccounts() {
    const currentHost = encodeURI(window.location.host);

    GM.xmlHttpRequest({
        method: "GET",
        url: `http://qapass.codecons.com/api/passwords?host=${currentHost}`,
        headers: {
            "Authorization": `Bearer ${GM_config.get("ApiKey")}:${GM_config.get("ApiSecret")}`
        },
        onload: function(response) {
            if (response.status === 401) {
                const accountElement = document.createElement("div");
                accountElement.className = "qapass-account-no-results";

                let html = "Unauthorized. Please make sure that API Key and API Secret are valid.";
                accountElement.innerHTML = html;
                list.appendChild(accountElement);
                return;
            }
            if (response.status !== 200) {
                const accountElement = document.createElement("div");
                accountElement.className = "qapass-account-no-results";

                let html = "Uh oh. Something's not right! Please try again later.";
                accountElement.innerHTML = html;
                list.appendChild(accountElement);
                return;
            }

            const results = JSON.parse(response.responseText);
            const list = document.querySelector("#qapass-container .qapass-account-list");

            if (results.length === 0) {
                const accountElement = document.createElement("div");
                accountElement.className = "qapass-account-no-results";

                let html = `No results found for ${currentHost}`;
                accountElement.innerHTML = html;
                list.appendChild(accountElement);
            } else {
                results.forEach((account) => {

                    const accountElement = document.createElement("div");
                    accountElement.className = "qapass-account";

                    let html = `
<div class="qapass-account-info">
    <div class="qapass-username">${account.username}</div>
    <div class="qapass-password">${account.password}</div>
    <div class="qapass-description">${account.description}</div>
</div>
<div role="button" class="qapass-account-login">Login</div>
`;
                    accountElement.innerHTML = html;
                    list.appendChild(accountElement);
                });
            }

            document.querySelector("#qapass-container").classList.remove("qapass-hidden");
            addEventHandlers();
        }
    });
}

function addEventHandlers() {
    var disableClick = false;

    document.querySelectorAll("#qapass-container .qapass-account-login").forEach(function(node) {
        node.addEventListener("click", function(e) {
            if (disableClick) return;

            e.target.className += " qapass-account-login-spinner";

            const spinner = document.createElement("div");
            spinner.className = "qapass-spinner";
            e.target.appendChild(spinner);

            const account = e.target.closest(".qapass-account");
            document.querySelector("[name='user[email]']").value = account.querySelector(".qapass-username").innerText;
            document.querySelector("[type=password]").value = account.querySelector(".qapass-password").innerText;
            document.querySelector("[type=password]").closest("form").querySelector("input[type=submit]").click();

            disableClick = true;
        });
    });
}

(function() {
    "use strict";

    GM_addStyle(css);

    const container = document.createElement("div");
    container.id = "qapass-container";
    container.className = "qapass-hidden";
    container.innerHTML = html;
    document.body.appendChild(container);

    document.querySelector("#qapass-container .qapass-close").addEventListener("click", function() {
        container.style.transform = "scale(0)";
    });

    fetchAccounts();

    if (!GM_config.get("ApiKey") || !GM_config.get("ApiSecret")) {
        GM_config.open();
    }
})();