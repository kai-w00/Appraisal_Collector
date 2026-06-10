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

    <hr class="panel-divider" />

    <h2>예상 감정평가액</h2>

    <div class="calc-box">
      <label>공시가격 또는 기준가격</label>
      <input id="officialPriceInput" type="number" placeholder="예: 800000000" />

      <button id="calcButton">예상 감평액 계산</button>

      <div id="calcResult" class="calc-result">
        기준가격을 입력하고 계산하세요.
      </div>
    </div>
  `;

  document.getElementById("calcButton").addEventListener("click", () => {
    const officialPrice = document.getElementById("officialPriceInput").value;

    const result = calculateAppraisal({
      officialPrice,
      type: project.type,
      stage: project.stage,
      district: project.district
    });

    document.getElementById("calcResult").innerHTML = `
      <div class="result-row">
        <span>낮은 추정</span>
        <strong>${formatWon(result.low)}</strong>
      </div>
      <div class="result-row main">
        <span>중간 추정</span>
        <strong>${formatWon(result.mid)}</strong>
      </div>
      <div class="result-row">
        <span>높은 추정</span>
        <strong>${formatWon(result.high)}</strong>
      </div>
      <p class="calc-note">
        ※ 실제 감정평가액이 아닌 간이 추정값입니다.
      </p>
    `;
  });
}
