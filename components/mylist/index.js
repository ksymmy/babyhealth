
Component({
  mixins:[{ didMount() {}, }],
  data: {
    counter:2
    },
  props:{
    label:'',
    text:'',
    },
  didUpdate(prevProps,prevData){},
  didUnmount(){},
  methods:{
    onMyClick(ev){
      dd.alert({});
      this.props.onXX({ ...ev, e2:1});
    },
  },
})