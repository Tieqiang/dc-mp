import { on } from '@/libs/tools'
import store from "../store";
import {arrayAnyOne} from "../libs/util";


const directives = {
  draggable: {
    inserted: (el, binding, vnode) => {
      let triggerDom = document.querySelector(binding.value.trigger)
      triggerDom.style.cursor = 'move'
      let bodyDom = document.querySelector(binding.value.body)
      let pageX = 0
      let pageY = 0
      let transformX = 0
      let transformY = 0
      let canMove = false
      const handleMousedown = e => {
        let transform = /\(.*\)/.exec(bodyDom.style.transform)
        if (transform) {
          transform = transform[0].slice(1, transform[0].length - 1)
          let splitxy = transform.split('px, ')
          transformX = parseFloat(splitxy[0])
          transformY = parseFloat(splitxy[1].split('px')[0])
        }
        pageX = e.pageX
        pageY = e.pageY
        canMove = true
      }
      const handleMousemove = e => {
        let xOffset = e.pageX - pageX + transformX
        let yOffset = e.pageY - pageY + transformY
        if (canMove) bodyDom.style.transform = `translate(${xOffset}px, ${yOffset}px)`
      }
      const handleMouseup = e => {
        canMove = false
      }
      on(triggerDom, 'mousedown', handleMousedown)
      on(document, 'mousemove', handleMousemove)
      on(document, 'mouseup', handleMouseup)
    },
    update: (el, binding, vnode) => {
      if (!binding.value.recover) return
      let bodyDom = document.querySelector(binding.value.body)
      bodyDom.style.transform = ''
    }
  },
  hasPermission:(el,binding,vnode)=>{
    console.log("权限判断开始")
    console.log(el)
    let permission = binding.value;
    let permissions = permission.split('|')
    if(store.state.user.hasGetInfo){
      let allAccess=store.state.user.access
      if(!arrayAnyOne(permissions,allAccess)){
        el.style.display="none"
      }
    }

  }
}

export default directives
