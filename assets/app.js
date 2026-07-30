// assets/app.js
const username = document.getElementById('username').textContent.trim() || 'IT-SUPERBHYPER';
const repoGrid = document.getElementById('repoGrid');
const stats = document.getElementById('stats');
const errorEl = document.getElementById('error');
const tokenInput = document.getElementById('token');
const saveBtn = document.getElementById('saveToken');
const clearBtn = document.getElementById('clearToken');
const searchInput = document.getElementById('search');
const sortSelect = document.getElementById('sort');
const refreshBtn = document.getElementById('refresh');

// Load saved token from localStorage
const TOKEN_KEY = 'tahir_dashboard_github_token';
const saved = localStorage.getItem(TOKEN_KEY);
if(saved){ tokenInput.value = saved; }

saveBtn.onclick = () => { localStorage.setItem(TOKEN_KEY, tokenInput.value); alert('Token saved to localStorage (used for private repos).'); }
clearBtn.onclick = () => { localStorage.removeItem(TOKEN_KEY); tokenInput.value=''; alert('Token cleared from localStorage.'); }

async function fetchRepos(){
  errorEl.hidden = true;
  stats.textContent = 'Fetching repositories...';
  repoGrid.innerHTML = '';
  try{
    const token = localStorage.getItem(TOKEN_KEY) || '';
    let headers = { 'Accept':'application/vnd.github.v3+json' };
    if(token) headers['Authorization'] = `token ${token}`;

    // fetch public + private (if token has access)
    const url = `https://api.github.com/users/${username}/repos?per_page=200&type=all&sort=updated`;
    const res = await fetch(url, { headers });
    if(res.status === 401){ throw new Error('Unauthorized - invalid token'); }
    if(res.status === 403){ throw new Error('API rate limit or access blocked. Try using a token.'); }
    if(!res.ok){ throw new Error('Failed to fetch repos: '+res.status+' '+res.statusText); }
    const repos = await res.json();
    if(!Array.isArray(repos)) throw new Error('Unexpected response: '+JSON.stringify(repos));

    renderRepos(repos);
  }catch(err){
    errorEl.hidden = false;
    errorEl.textContent = err.message;
    stats.textContent = 'Could not load repositories.';
  }
}

function renderRepos(repos){
  let filtered = repos.slice();
  const q = searchInput.value.trim().toLowerCase();
  if(q){ filtered = filtered.filter(r => (r.name||'').toLowerCase().includes(q) || (r.description||'').toLowerCase().includes(q)); }

  const sortBy = sortSelect.value;
  filtered.sort((a,b)=>{
    if(sortBy==='stars') return (b.stargazers_count||0)-(a.stargazers_count||0);
    if(sortBy==='forks') return (b.forks_count||0)-(a.forks_count||0);
    if(sortBy==='name') return (a.name||'').localeCompare(b.name||'');
    // updated
    return new Date(b.updated_at) - new Date(a.updated_at);
  });

  stats.textContent = `Showing ${filtered.length} of ${repos.length} repositories`;
  repoGrid.innerHTML = '';
  if(filtered.length===0){ repoGrid.innerHTML = '<p style="color:var(--muted)">No repositories found.</p>'; return; }

  for(const r of filtered){
    const card = document.createElement('article');
    card.className = 'repo-card';
    card.innerHTML = `
      <div class="repo-title">
        <h3><a href="${r.html_url}" target="_blank" rel="noopener" style="color:inherit;text-decoration:none">${r.name}</a></h3>
        <div class="meta-pill">${r.private?'<svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 11a2 2 0 100-4 2 2 0 000 4z" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>':''}${r.private?'<span style="font-size:12px;color:var(--muted);margin-left:6px">Private</span>':''}</div>
      </div>
      <p class="repo-desc">${r.description?escapeHtml(r.description):'<span style="color:var(--muted)">No description</span>'}</p>
      <div class="repo-meta">
        <div class="meta-pill">★ ${r.stargazers_count||0}</div>
        <div class="meta-pill">🍴 ${r.forks_count||0}</div>
        <div class="meta-pill">${r.language||'—'}</div>
        <div class="meta-pill">Updated ${timeAgo(r.updated_at)}</div>
      </div>
      <div class="repo-footer">
        <div style="color:var(--muted);font-size:12px">${r.watchers_count||0} watchers</div>
        <a class="btn-visit" href="${r.html_url}" target="_blank" rel="noopener">Open</a>
      </div>
    `;
    repoGrid.appendChild(card);
  }
}

function timeAgo(dt){
  const d = new Date(dt);
  const diff = Date.now() - d.getTime();
  const mins = Math.floor(diff/60000);
  if(mins<60) return `${mins}m`;
  const hrs = Math.floor(mins/60);
  if(hrs<24) return `${hrs}h`;
  const days = Math.floor(hrs/24);
  if(days<30) return `${days}d`;
  const months = Math.floor(days/30);
  if(months<12) return `${months}mo`;
  return `${Math.floor(months/12)}y`;
}

function escapeHtml(text){
  return text.replace(/[&<>"']/g, function(tag){
    const chars = {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"};
    return chars[tag] || tag;
  });
}

// Event bindings
searchInput.addEventListener('input', debounce(()=> fetchRepos().then(()=>{}), 350));
sortSelect.addEventListener('change', () => fetchRepos());
refreshBtn.addEventListener('click', fetchRepos);

// Debounce helper
function debounce(fn, delay){ let t; return (...a)=>{ clearTimeout(t); t=setTimeout(()=>fn.apply(this,a),delay); }; }

// Initial load
fetchRepos();

