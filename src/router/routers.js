import sysRouters from './sys-routers'
import testRouters from './test-routers'
import priRouters from './pri-routers'
import templateRouters from './template-routers'

let routers = []

sysRouters.forEach((item) => {
  routers.push(item)
})

testRouters.forEach(item => {
  routers.push(item)
})

priRouters.forEach(item => {
  routers.push(item)
})

templateRouters.forEach(item => {
  routers.push(item)
})

export default routers
