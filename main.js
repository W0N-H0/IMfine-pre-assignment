document.addEventListener("DOMContentLoaded", function () {
  const chartCanvas = document.getElementById("chartCanvas");
  const chartContext = chartCanvas.getContext("2d");
  const valueList = document.getElementById("valueList");
  const newIdInput = document.getElementById("newId");
  const newValueInput = document.getElementById("newValue");

  // 예시 데이터 - ID와 값을 포함한 배열
  let data = [
    { id: 0, value: 100 },
    { id: 2, value: 50 },
  ];

  // 그래프 그리기 함수
  function drawChart() {
    chartContext.clearRect(0, 0, chartCanvas.width, chartCanvas.height);

    const barWidth = 30;
    const xOffset = 40;
    const yOffset = 20;

    const maxValue = 100; // 최대 값

    // x축와 y축 교차점을 그리기
    chartContext.strokeStyle = "black";
    chartContext.beginPath();
    chartContext.moveTo(xOffset, 0); // y축에서 시작
    chartContext.lineTo(xOffset, chartCanvas.height - yOffset); // y축 끝까지
    chartContext.lineTo(chartCanvas.width, chartCanvas.height - yOffset); // x축 끝까지
    chartContext.stroke();

    // y축에 100 표현
    chartContext.fillStyle = "black";
    chartContext.fillText("100", xOffset - 30, 25); // xOffset 왼쪽에 위치

    data.forEach((item, index) => {
      const value = item.value;

      // 첫 번째 막대의 x 위치를 xOffset에서 좀만 더 오른쪽으로 옮김
      const x = index * (barWidth + xOffset) + xOffset + 10;

      const height = (value / maxValue) * (chartCanvas.height - yOffset * 2);
      const y = chartCanvas.height - height - yOffset;

      chartContext.fillStyle = "blue";
      chartContext.fillRect(x, y, barWidth, height);

      chartContext.fillStyle = "black";
      chartContext.fillText(
        item.id,
        x + barWidth / 2 - 5,
        chartCanvas.height - 5
      );
    });
  }

  // 표 업데이트 함수
  function updateValueList() {
    valueList.innerHTML = ""; // 현재 목록 지우기
    data.forEach((item) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td><input type="number" value="${item.id}" min="1"></td>
        <td><input type="number" value="${item.value}" min="1" max="100"></td>
        <td><button data-id="${item.id}">편집</button></td>
      `;
      valueList.appendChild(row);
    });
  }

  // Apply 버튼 클릭 시 이벤트 핸들러
  document.getElementById("applyButton").addEventListener("click", function () {
    const inputElements = valueList.querySelectorAll("input");
    const newData = data.map((item) => ({ ...item })); // 기존 데이터 배열을 복사합니다.

    inputElements.forEach((input) => {
      const id = parseInt(
        input.closest("tr").querySelector("td:first-child input").value,
        10
      );
      const value = parseFloat(
        input.closest("tr").querySelector("td:nth-child(2) input").value
      );

      if (isNaN(value) || value < 1 || value > 100) {
        alert("유효한 VALUE를 올바르게 입력하세요 (1에서 100 사이).");
        return;
      }

      // 새 배열에 수정된 값을 업데이트
      const index = newData.findIndex((item) => item.id === id);
      if (index !== -1) {
        newData[index].value = value;
      }
    });

    newData.sort((a, b) => a.id - b.id);
    data = newData; // 기존 데이터 배열을 새로운 배열로 업데이트
    console.log(data);
    updateValueList(); // 표 업데이트
    drawChart(); // 그래프 업데이트
  });

  // 값 편집 버튼 클릭 시 이벤트 핸들러
  valueList.addEventListener("click", function (event) {
    if (event.target.tagName === "BUTTON") {
      const id = parseInt(event.target.getAttribute("data-id"), 10);
      const inputElement =
        event.target.parentElement.previousElementSibling.previousElementSibling.querySelector(
          "input"
        );
      if (inputElement) {
        const value = parseFloat(
          inputElement.parentElement.nextElementSibling.querySelector("input")
            .value
        );

        if (isNaN(value) || value < 1 || value > 100) {
          alert("유효한 VALUE를 올바르게 입력하세요 (1에서 100 사이).");
          return;
        }

        data.find((item) => item.id === id).value = value;
        drawChart();
      }
    }
  });

  // 초기화
  updateValueList();
  drawChart();
});
