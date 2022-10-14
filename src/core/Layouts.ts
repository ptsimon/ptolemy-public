import { Layout } from 'react-grid-layout'

interface Tile {
  name: string
  priority: number
  x: number
  y: number
  width: number
  height: number
}

// Generates the layout for grid in the format GridLayout requires
// Input: GRID_DICT constants (depending on screen size)
// Output: layout object
const generateLayout = (gridLayout: Tile[], gridStartY: number) => {
  //Define vertical starting point of grid
  let currentY = gridStartY
  //First sort the items by priority
  gridLayout.sort((a, b) => (a.priority > b.priority ? 1 : -1))
  //Create Layout Object
  const layout: Layout[] = []
  //Loop through each item, generate Y coordinates & corresponding layout object
  gridLayout.forEach((element) => {
    const layoutItem = {
      i: element.name,
      x: element.x,
      y: currentY,
      w: element.width,
      h: element.height,
    }
    layout.push(layoutItem)
    //Update current Y to set next tile's starting Y position
    currentY = currentY + element.height
  })
  return layout
}

const GRID_START_Y = 0 //Define Y coord of grid start
const LG_GRID_DICT: Tile[] = [
  //Define the individual tile positions & heights for our grid for Large sized screens (desktop screens at 100%)
  { name: 'title', priority: 1, x: 0, y: 0, width: 12, height: 2 },
  { name: 'chart', priority: 2, x: 0, y: 0, width: 12, height: 9 },
  { name: 'assumptions', priority: 3, x: 0, y: 0, width: 6, height: 20 },
  { name: 'breakdown', priority: 3, x: 6, y: 0, width: 6, height: 17 },
  { name: 'code', priority: 4, x: 0, y: 0, width: 12, height: 4 },
  { name: 'projections', priority: 5, x: 0, y: 0, width: 12, height: 17 },
  { name: 'insights', priority: 6, x: 0, y: 0, width: 12, height: 2 },
]

const MD_GRID_DICT: Tile[] = [
  //Define the individual tile positions & heights for Medium sized screens (laptop screens at 125%)
  { name: 'title', priority: 1, x: 0, y: 0, width: 10, height: 2 },
  { name: 'chart', priority: 2, x: 0, y: 0, width: 10, height: 9 },
  { name: 'assumptions', priority: 3, x: 0, y: 0, width: 3, height: 20 },
  { name: 'breakdown', priority: 3, x: 6, y: 0, width: 3, height: 17 },
  { name: 'code', priority: 4, x: 0, y: 0, width: 10, height: 4 },
  { name: 'projections', priority: 5, x: 0, y: 0, width: 10, height: 17 },
  { name: 'insights', priority: 6, x: 0, y: 0, width: 10, height: 2 },
]

const LG_LAYOUT: Layout[] = generateLayout(LG_GRID_DICT, GRID_START_Y)
const MD_LAYOUT: Layout[] = generateLayout(MD_GRID_DICT, GRID_START_Y)

export default { lg: LG_LAYOUT, md: MD_LAYOUT }
