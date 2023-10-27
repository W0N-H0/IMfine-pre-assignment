// 예시 데이터 - ID와 값을 포함한 배열
let data = [
  { id: 0, value: 100 },
  { id: 1, value: 50 },
];

document.addEventListener("DOMContentLoaded", function () {
  const chartCanvas = document.querySelector(".graph-section__chart-canvas");
  const chartContext = chartCanvas.getContext("2d");
  const valueList = document.querySelector(".table__body");
  const newIdInput = document.querySelector(".input--id");
  const newValueInput = document.querySelector(".input--value");

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

    // y축에 0, 100 표현
    chartContext.fillStyle = "black";
    chartContext.fillText("100", xOffset - 30, 25); // xOffset 왼쪽에 위치
    chartContext.fillText("0", xOffset - 20, 275); // xOffset 왼쪽에 위치

    data.forEach((item, index) => {
      const value = item.value;

      // 첫 번째 막대의 x 위치를 xOffset에서 좀만 더 오른쪽으로 옮김
      const x = index * (barWidth + xOffset) + xOffset + 35;

      const height = (value / maxValue) * (chartCanvas.height - yOffset * 2);
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

  // 표 업데이트 함수
  function updateValueList() {
    valueList.innerHTML = ""; // 현재 목록 지우기
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

  // 값 삭제 버튼 클릭 시 이벤트 핸들러
  valueList.addEventListener("click", function (event) {
    if (event.target.classList.contains("button--delete")) {
      const id = parseInt(event.target.getAttribute("data-id"), 10);
      data = data.filter((item) => item.id !== id);
      updateValueList();
      drawChart();
      displayDataAsJson();
    }
  });

  // Apply 버튼 클릭 시 이벤트 핸들러
  document
    .querySelector(".button--apply")
    .addEventListener("click", function () {
      const inputElements = valueList.querySelectorAll("input");
      const newData = data.map((item) => ({ ...item })); // 기존 데이터 배열을 복사합니다.

      inputElements.forEach((input) => {
        const id = parseInt(
          input
            .closest(".table-body__row")
            .querySelector(".table-body__cell:first-child div").textContent,
          10
        );
        const value = parseFloat(input.value);

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
      updateValueList(); // 표 업데이트
      drawChart(); // 그래프 업데이트
      displayDataAsJson(); // JSON 데이터 업데이트
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

        if (isNaN(value) || value < 0 || value > 100) {
          alert("유효한 VALUE를 올바르게 입력하세요 (1에서 100 사이).");
          return;
        }

        data.find((item) => item.id === id).value = value;
        drawChart();
        displayDataAsJson();
      }
    }
  });

  // Add 버튼 클릭 시 이벤트 핸들러
  document.querySelector(".button--add").addEventListener("click", function () {
    const newId = parseInt(newIdInput.value, 10);
    const newValue = parseFloat(newValueInput.value);

    // ID 중복 확인
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

    // 기존 데이터에 새로운 항목 추가
    data.push({ id: newId, value: newValue });
    data.sort((a, b) => a.id - b.id);
    newIdInput.value = "";
    newValueInput.value = "";
    updateValueList();
    drawChart();
    displayDataAsJson();
  });

  // 초기화
  updateValueList();
  drawChart();

  // 4. 값 고급 편집
  const advancedEditSection = document.querySelector(
    ".advancedEdit-section__content"
  );

  // JSON 문자열로 데이터 표시하는 함수
  function displayDataAsJson() {
    const div = document.createElement("div");
    div.textContent = JSON.stringify(data, null, 2);
    div.setAttribute("contenteditable", true); // contenteditable 속성 추가
    advancedEditSection.innerHTML = "";
    advancedEditSection.appendChild(div);

    // Apply 버튼 클릭 시 이벤트 핸들러
    const applyButton = document.querySelector(".button--advanced-apply");
    applyButton.addEventListener("click", function () {
      try {
        // 이전 데이터 저장
        previousData = [...data];

        // JSON 파싱 및 업데이트
        const newData = JSON.parse(div.textContent);
        if (Array.isArray(newData)) {
          // ID 중복 확인을 위한 Set
          const idSet = new Set();

          // 데이터가 유효한지 확인하고 ID 중복을 검사
          const isValidData = newData.every((item) => {
            if (
              !Number.isInteger(item.id) ||
              item.id < 0 ||
              item.id > 100 ||
              idSet.has(item.id) ||
              item.value < 0 ||
              item.value > 100
            ) {
              return false;
            }
            idSet.add(item.id);
            return true;
          });

          if (!isValidData) {
            alert(
              "유효하지 않은 데이터 형식이거나 중복된 ID가 있거나 VALUE가 0과 100 사이가 아닌 항목이 있습니다."
            );

            // 오류 발생 시 이전 데이터로 복원
            data = previousData;
            updateValueList();
            drawChart();
            displayDataAsJson();
            return;
          }

          data = newData; // 데이터를 업데이트
          updateValueList(); // 표 업데이트
          drawChart(); // 그래프 업데이트
          displayDataAsJson(); // JSON 데이터 업데이트
        } else {
          alert("유효한 JSON 데이터 형식이 아닙니다.");

          // 오류 발생 시 이전 데이터로 복원
          data = previousData;
          updateValueList();
          drawChart();
          displayDataAsJson();
        }
      } catch (error) {
        alert("유효한 JSON 데이터 형식이 아닙니다.");

        // 오류 발생 시 이전 데이터로 복원
        data = previousData;
        updateValueList();
        drawChart();
        displayDataAsJson();
      }
    });
  }

  // 초기화 시 JSON 데이터 표시
  displayDataAsJson();
});
