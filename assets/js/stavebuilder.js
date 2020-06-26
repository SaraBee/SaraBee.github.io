const density = 0.4;
const square_dim = 20;

const shapes = {
'e' : [[1,0,0]],
't' : [[1,0,0],[1,0,0]],
'a' : [[1,1,0]],
'i' : [[1,1,0],[1,0,0]],
'o' : [[1,0,0],[1,1,0]],
'n' : [[1,1,0],[0,1,0]],
's' : [[0,1,0],[1,1,0]],
'r' : [[1,1,0],[1,1,0]],
'h' : [[1,1,1]],
'd' : [[1,0,0],[1,0,0],[1,0,0]],
'l' : [[1,1,0],[1,0,0],[1,0,0]],
'u' : [[1,0,0],[1,0,0],[1,1,0]],
'c' : [[1,1,0],[0,1,0],[0,1,0]],
'm' : [[0,1,0],[0,1,0],[1,1,0]],
'f' : [[1,0,0],[1,1,0],[1,0,0]],
'y' : [[0,1,0],[1,1,0],[0,1,0]],
'w' : [[1,1,0],[1,1,0],[1,0,0]],
'g' : [[1,0,0],[1,1,0],[1,1,0]],
'p' : [[1,1,0],[1,1,0],[0,1,0]],
'b' : [[0,1,0],[1,1,0],[1,1,0]],
'k' : [[1,1,0],[1,0,0],[1,1,0]],
'v' : [[1,1,0],[0,1,0],[1,1,0]],
'x' : [[1,1,1],[1,0,0],[1,0,0]],
'q' : [[1,0,0],[1,0,0],[1,1,1]],
'j' : [[1,1,1],[0,0,1],[0,0,1]],
'z' : [[0,0,1],[0,0,1],[1,1,1]],
' ' : [[0,0,0],[0,0,0]]
};

const space = [0,0,0,1,0,0,0];
const empty_row = [0,0,0,0,0,0,0];

const filler_shapes = [
  [[1]],
  [[1,1,1],[1,0,1],[1,1,1]],
];

const stave_width = 7;

// charts are tuples like [width, height, offset] where offset indicates how far
// from the left side of the chart the box should begin
const boxes = [[10,8,4],[15,12,2],[20,15,0]]; // golden moon chart dims

let filled_boxes = [];
let center_col = 0;
let center_row = 0;

let chart = [];

function buildStave(word) {
  stave = [];
  stave.push(empty_row);
  letters = word.split('');
  letters.forEach(function(letter) {
    stave.push(space); // starting top of stave with space for orientation cue

    shape = shapes[letter];
    shape.forEach(function(row) {
      stave.push(buildStaveRow(row));
    });
  });

  stave.push(empty_row);
  return stave;
}

function buildStaveRow(row) {
  stave_row_left = row.slice().reverse();
  stave_row_left.push(1); // center stave is always 1
  stave_row = stave_row_left.concat(row);
  return stave_row;
}

function fillBox(chart_box) {
  filled_box = [];
  for(let i = 0; i < chart_box[1]; i++) {
      row_array = new Array(chart_box[0]);
      filled_box.push(row_array);
  }

  // center of stave will be at global center minus offset
  local_center = center_col - (chart_box[2] + 1);

  right_sided = false;
  even = (chart_box[0] % 2 == 0);
  right_sided = (even && local_center < chart_box[0] / 2);

  for (let i = 0; i < chart_box[1]; i++) {
    for (let j = 0; j < local_center; j++) {
      if (even && !right_sided && j == 0) continue;
      if (filled_box[i][j - 1]) continue;
      if (filled_box[i][j]) continue;
      if (Math.random() >= density) continue;

      shape_index = Math.floor(Math.random() * filler_shapes.length);
      shape = filler_shapes[shape_index];

      if (j + shape[0].length > local_center || i + shape.length > chart_box[1]) {
        shape = [[1]];
      }

      for (let k = 0; k < shape.length; k++) {
        for (let l = 0; l < shape[0].length; l++) {
          filled_box[i+k][j+l] = shape[k][l];

          if (!even) {
            filled_box[i+k][(chart_box[0] - 1) - (j + l)] = shape[k][l];
          } else if (right_sided) {
            filled_box[i+k][(chart_box[0] - 1) - (j + l) - 1] = shape[k][l];
          } else {
            filled_box[i+k][(chart_box[0] - 1) - (j + l) + 1] = shape[k][l];
          }
        }
      }
    }
  }

  return [filled_box, chart_box[2]];
}

function buildChart() {
  // the chart is secretly the max width of all boxes x the height of all boxes together
  chart_width = 0;
  chart_height = 0;
  boxes.forEach(function(box) {
    chart_width = Math.max(box[0], chart_width);
    chart_height += box[1];
  });

  // find centered placement for stave in chart
  center_col = Math.ceil(chart_width / 2);
  center_row = Math.ceil(chart_height / 2);

  boxes.forEach(function(box) {
    filled_boxes.push(fillBox(box));
  });

  // all together now! let's go through the whole chart and decide whether a square is
  // in the chart, and if so, whether it is MC (0) or CC (1)
  //let chart = [];
  current_row = 0;
  filled_boxes.forEach(function(box) {
    // Going through each row in the box
    box_chart = box[0];
    offset = box[1];
    for(let i = 0; i < box_chart.length; i++) {
      row = [];
      // Going through each square in the row
      for(let j = 0; j < chart_width; j++) {

        // out of bounds
        if (j < offset || j >= box_chart[0].length + offset) {
          row[j] = -1;
        } else {
          row[j] = box_chart[i][j - offset];
        }
      }
      chart[current_row] = row;
      current_row += 1;
    }
  });
}

function stampStave(stave) {
  stave_height = stave.length;

  stave_x = center_col - Math.ceil(stave_width / 2);
  stave_y = center_row - Math.ceil(stave_height / 2);

  let stamped_chart = chart.map(function(row){
    return row.slice();
  });

  for (let i = 0; i < chart.length; i++) {
    for (let j = 0; j < chart[0].length; j++) {
      if((i >= stave_y && i < (stave_y + stave_height)) && (j >= stave_x && j < (stave_x + stave_width))) {
        stamped_chart[i][j] = stave[i - stave_y][j - stave_x];
      } else {
        stamped_chart[i][j] = chart[i][j];
      }
    }
  }

  return stamped_chart;
}

function drawStave() {
  input_word = text_input.value();
  new_stave = buildStave(input_word);

  stamped_chart = stampStave(new_stave);

  drawChart(stamped_chart);
}

function drawChart(chart) {
  background(0, 42, 53);
  for (let y = 0; y < chart.length; y++) {
    for (let x = 0; x < chart[0].length; x++) {
      let xpos = x * square_dim;
      let ypos = y * square_dim;

      if (chart[y][x] == -1){
        fill(80);
      } else if (chart[y][x] == 1) {
        fill(120);
      } else {
      	fill(255);
      }

      stroke(0);
      rect(xpos, ypos, square_dim, square_dim);
    }
  }

  colorMode(RGB);
}

function invertPixel() {
  chart_x = Math.floor(mouseX / square_dim);
  chart_y = Math.floor(mouseY / square_dim);

  if (chart_y < chart.length && chart_x < chart[0].length && chart[chart_y][chart_x] != -1) {
    if (chart[chart_y][chart_x] === undefined) {
      chart[chart_y][chart_x] = 1;
    } else {
      chart[chart_y][chart_x] = Math.abs(chart[chart_y][chart_x] - 1);
    }
    drawStave();
  }
}

function setup() {
  buildChart();
  height = chart.length * square_dim;
  canvas = createCanvas(500, height);
  canvas.mousePressed(invertPixel);

  text_input = createInput();
  draw_button = createButton("draw");
  draw_button.mousePressed(drawStave);

  drawStave();
}
