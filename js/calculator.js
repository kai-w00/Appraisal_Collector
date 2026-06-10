function calculateAppraisal(input) {
  const officialPrice = Number(input.officialPrice || 0);

  const typeRate = {
    "재개발": 1.18,
    "재건축": 1.25
  };

  const stageRate = {
    "정비구역 지정": 1.05,
    "정비계획 수립": 1.08,
    "사업시행인가": 1.15,
    "관리처분인가": 1.22
  };

  const locationRate = {
    "강남구": 1.18,
    "서초구": 1.16,
    "송파구": 1.14,
    "용산구": 1.15,
    "성동구": 1.1
  };

  const base =
    officialPrice *
    (typeRate[input.type] || 1.1) *
    (stageRate[input.stage] || 1.05) *
    (locationRate[input.district] || 1.0);

  return {
    low: Math.round(base * 0.9),
    mid: Math.round(base),
    high: Math.round(base * 1.1)
  };
}

function formatWon(value) {
  return value.toLocaleString("ko-KR") + "원";
}
