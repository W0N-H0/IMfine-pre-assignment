document.addEventListener("DOMContentLoaded", function () {
  const chartCanvas = document.getElementById("chartCanvas");
  const chartContext = chartCanvas.getContext("2d");
  const valueList = document.getElementById("valueList");
  const newIdInput = document.getElementById("newId");
  const newValueInput = document.getElementById("newValue");

  //  ID와 값을 포함한 배열 - 여기에 추가 데이터 추가
  let data = [];

  // 그래프 그리기 함수
  function drawChart() {
    chartContext.clearRect(0, 0, chartCanvas.width, chartCanvas.height);

    const barWidth = 30;
    const xOffset = 40;
    const yOffset = 20;

    for (let i = 0; i < data.length; i++) {
      const value = data[i].value;
      const x = i * (barWidth + xOffset) + xOffset;
      const height = (value / 10) * 20;
      const y = chartCanvas.height - height - yOffset;

      chartContext.fillStyle = "blue";
      chartContext.fillRect(x, y, barWidth, height);

      chartContext.fillStyle = "black";
      chartContext.fillText(value, x + barWidth / 2 - 5, y - 5);
    }
  }

  // 표 업데이트 함수
  function updateValueList() {
    valueList.innerHTML = ""; // 현재 목록 지우기
    data.forEach((item) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${item.id}</td>
        <td><input type="number" value="${item.value}"></td>
        <td><button data-id="${item.id}">편집</button></td>
      `;
      valueList.appendChild(row);
    });
  }

  // Apply 버튼 클릭 시 이벤트 핸들러
  document.getElementById("applyButton").addEventListener("click", function () {
    const inputElements = valueList.querySelectorAll("input");
    inputElements.forEach((input, index) => {
      data[index].value = parseFloat(input.value);
    });
    drawChart();
  });

  // Add 버튼 클릭 시 이벤트 핸들러
  document.getElementById("addButton").addEventListener("click", function () {
    const newId = parseInt(newIdInput.value, 10);
    const newValue = parseFloat(newValueInput.value);

    if (isNaN(newId) || isNaN(newValue)) {
      alert("ID와 VALUE를 올바르게 입력하세요.");
      return;
    }

    if (data.some((item) => item.id === newId)) {
      alert("중복된 ID가 있습니다. 다른 ID를 사용하세요.");
      return;
    }

    data.push({ id: newId, value: newValue });
    newIdInput.value = "";
    newValueInput.value = "";
    updateValueList();
    drawChart();
  });

  // 값 편집 버튼 클릭 시 이벤트 핸들러
  valueList.addEventListener("click", function (event) {
    if (event.target.tagName === "BUTTON") {
      const id = parseInt(event.target.getAttribute("data-id"), 10);
      const inputElement =
        event.target.parentElement.previousElementSibling.querySelector(
          "input"
        );
      if (inputElement) {
        const value = parseFloat(inputElement.value);
        if (!isNaN(value)) {
          data.find((item) => item.id === id).value = value;
          drawChart();
        }
      }
    }
  });

  // 초기화
  updateValueList();
  drawChart();
});
