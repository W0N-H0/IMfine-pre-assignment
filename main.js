// 문서가 로드되면 실행
document.addEventListener("DOMContentLoaded", function () {
  // 그래프 그리기를 위한 캔버스와 컨텍스트 가져오기
  const chartCanvas = document.querySelector(".graph-section__chart-canvas");
  const chartContext = chartCanvas.getContext("2d");

  // 테이블과 입력 요소들 가져오기
  const valueList = document.querySelector(".table__body");
  const newIdInput = document.querySelector(".input--id");
  const newValueInput = document.querySelector(".input--value");

  // 그래프 그리기에 필요한 상수 정의
  const barWidth = 30;
  const xOffset = 40;
  const yOffset = 20;
  const maxValue = 100;

  // 데이터 배열 초기화
  let data = [
    { id: 0, value: 100 },
    { id: 1, value: 50 },
  ];

  // 그래프 그리는 함수
  function drawGraph() {
    chartContext.clearRect(0, 0, chartCanvas.width, chartCanvas.height);
    chartContext.strokeStyle = "black";
    chartContext.beginPath();
    chartContext.moveTo(xOffset, 0);
    chartContext.lineTo(xOffset, chartCanvas.height - yOffset);
    chartContext.lineTo(chartCanvas.width, chartCanvas.height - yOffset);
    chartContext.stroke();
    chartContext.fillStyle = "black";
    chartContext.fillText("100", xOffset - 30, 25);
    chartContext.fillText("0", xOffset - 20, 275);

    data.forEach((item, index) => {
      const x = index * (barWidth + xOffset) + xOffset + 35;
      const height =
        (item.value / maxValue) * (chartCanvas.height - yOffset * 2);
      const y = chartCanvas.height - height - yOffset;

      chartContext.fillStyle = "#007bff";
      chartContext.fillRect(x, y, barWidth, height);

      chartContext.fillStyle = "black";
      chartContext.fillText(
        item.id,
        x + barWidth / 2 - 5,
        chartCanvas.height - 5
      );
    });
  }

  // 테이블 업데이트 함수
  function updateTable() {
    valueList.innerHTML = "";
    data.forEach((item) => {
      const row = document.createElement("tr");
      row.classList.add("table-body__row");
      row.innerHTML = `
        <td class="table-body__cell table-body__cell--id"><div>${item.id}</div></td>
        <td class="table-body__cell table-body__cell--value"><input type="number" value="${item.value}" min="1" max="100"></td>
        <td class="table-body__cell table-body__cell--delete"><button data-id="${item.id}" class="button button--delete">삭제</button></td>
      `;
      valueList.appendChild(row);
    });
  }

  // 테이블에서 데이터 업데이트하는 함수
  function updateDataFromTable() {
    const inputElements = valueList.querySelectorAll("input");
    const newData = data.map((item) => ({ ...item }));

    inputElements.forEach((input) => {
      const id = parseInt(
        input
          .closest(".table-body__row")
          .querySelector(".table-body__cell:first-child div").textContent,
        10
      );
      const value = parseFloat(input.value);

      if (isNaN(value) || value < 1 || value > 100) {
        alert("유효한 VALUE를 입력하세요. (1에서 100 사이)");
        return;
      }

      const index = newData.findIndex((item) => item.id === id);
      if (index !== -1) {
        newData[index].value = value;
      }
    });

    newData.sort((a, b) => a.id - b.id);

    const isConfirmed = confirm(
      "편집한 값이 일괄적으로 수정됩니다. 수정하시겠습니까?"
    );
    if (isConfirmed) {
      data = newData;
      updateTable();
      drawGraph();
      displayDataAsJson();
    }
  }

  // 데이터를 추가하는 함수
  function addData() {
    const newId = parseInt(newIdInput.value, 10);
    const newValue = parseFloat(newValueInput.value);

    if (data.some((item) => item.id === newId)) {
      alert("동일한 ID 값이 이미 존재합니다.");
      return;
    }

    if (
      isNaN(newId) ||
      isNaN(newValue) ||
      newId < 0 ||
      newId > 100 ||
      newValue < 0 ||
      newValue > 100
    ) {
      alert("유효한 ID와 VALUE를 올바르게 입력하세요.");
      return;
    }

    data.push({ id: newId, value: newValue });
    data.sort((a, b) => a.id - b.id);
    newIdInput.value = "";
    newValueInput.value = "";
    updateTable();
    drawGraph();
    displayDataAsJson();
  }

  // 삭제 버튼 클릭 이벤트 처리
  valueList.addEventListener("click", function (event) {
    if (event.target.classList.contains("button--delete")) {
      const id = parseInt(event.target.getAttribute("data-id"), 10);
      const isConfirmed = confirm("정말 삭제하시겠습니까?");
      if (isConfirmed) {
        data = data.filter((item) => item.id !== id);
        updateTable();
        drawGraph();
        displayDataAsJson();
      }
    }
  });

  // Apply 버튼 클릭 이벤트 처리
  document
    .querySelector(".button--apply")
    .addEventListener("click", updateDataFromTable);

  // 데이터 추가 버튼 클릭 이벤트 처리
  document.querySelector(".button--add").addEventListener("click", addData);

  // 데이터를 JSON 형식으로 표시하고 편집하는 함수
  function displayDataAsJson() {
    const advancedEditSection = document.querySelector(
      ".advancedEdit-section__content"
    );
    const div = document.createElement("div");
    div.textContent = JSON.stringify(data, null, 2);
    div.setAttribute("contenteditable", true);
    advancedEditSection.innerHTML = "";
    advancedEditSection.appendChild(div);

    let previousData = [...data];

    const applyButton = document.querySelector(".button--advanced-apply");
    applyButton.addEventListener("click", function () {
      try {
        const newData = JSON.parse(div.textContent);
        if (Array.isArray(newData)) {
          const idSet = new Set();
          const isValidData = newData.every((item) => {
            if (idSet.has(item.id) || item.value < 0 || item.value > 100) {
              return false;
            }
            idSet.add(item.id);
            return true;
          });

          if (!isValidData) {
            alert(
              "편집에 실패하였습니다.\n1. ID 값은 편집이 불가능합니다.\n2. VALUE 값은 0과 100 사이에서만 편집이 가능합니다."
            );
            data = previousData;
            updateTable();
            drawGraph();
            displayDataAsJson();
            return;
          }

          previousData = [...data];
          data = newData;
          updateTable();
          drawGraph();
          displayDataAsJson();
        }
      } catch (error) {
        alert("유효한 JSON 데이터 형식이 아닙니다.");
        data = previousData;
        updateTable();
        drawGraph();
        displayDataAsJson();
      }
    });
  }

  // 초기화
  displayDataAsJson();
  updateTable();
  drawGraph();
});
