let projects = [];

document.addEventListener("DOMContentLoaded", async () => {
  initMap();

  projects = await loadJson("./data/seoul_projects.json");
  const geojson = await loadJson("./data/seoul_redevelopment.geojson");

  renderProjectList(projects);
  renderGeoJson(geojson, projects, renderDetail);

  document.getElementById("searchInput").addEventListener("input", e => {
    const keyword = e.target.value.trim();
    const filtered = filterProjects(keyword);
    renderProjectList(filtered);
  });
});

function filterProjects(keyword) {
  if (!keyword) return projects;

  return projects.filter(p =>
    p.name.includes(keyword) ||
    p.district.includes(keyword) ||
    p.type.includes(keyword) ||
    p.stage.includes(keyword)
  );
}

function renderProjectList(list) {
  const container = document.getElementById("projectList");
  container.innerHTML = "";

  list.forEach(project => {
    const card = document.createElement("div");
    card.className = "project-card";
    card.innerHTML = `
      <div class="name">${project.name}</div>
      <div class="meta">${project.district} · ${project.type} · ${project.stage}</div>
    `;

    card.addEventListener("click", () => {
      focusProject(project.id);
    });

    container.appendChild(card);
  });
}

function renderDetail(project) {
  const el = document.getElementById("detailContent");

  el.innerHTML = `
    <div class="info-row">
      <div class="info-label">구역명</div>
      <div class="info-value">${project.name}</div>
    </div>

    <div class="info-row">
      <div class="info-label">자치구</div>
      <div class="info-value">${project.district}</div>
    </div>

    <div class="info-row">
      <div class="info-label">사업유형</div>
      <div class="info-value"><span class="badge">${project.type}</span></div>
    </div>

    <div class="info-row">
      <div class="info-label">진행단계</div>
      <div class="info-value">${project.stage}</div>
    </div>

    <div class="info-row">
      <div class="info-label">주소</div>
      <div class="info-value">${project.address}</div>
    </div>

    <div class="info-row">
      <div class="info-label">구역면적</div>
      <div class="info-value">${project.area}</div>
    </div>

    <div class="info-row">
      <div class="info-label">예상 세대수</div>
      <div class="info-value">${project.households}</div>
    </div>
  `;
}
