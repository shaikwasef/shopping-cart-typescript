import { Badge, Drawer, Grid, LinearProgress } from '@material-ui/core';
import {useState} from 'react' 
import Item from './Item/Item'
import Cart from './Cart'
import { useQuery } from 'react-query';
import {Wrapper , StyledButton} from './App.styles'
import { AddShoppingCart } from '@material-ui/icons';

//item return type of your fetch command
export type CartItemType = {
  id : number ;
  category : string ;
  description : string ;
  image : string ; 
  price : number ;
  title : string ;
  amount : number ;
}

//async returns a promise and it has an array of cart item types - read docs
const getProducts = async ()  : Promise<CartItemType[]> => 
  await (await fetch('https://fakestoreapi.com/products')).json();

const App =() =>  {
  //useQuery returns the data , status or error
  const [cartOpen , setCartOpen] = useState(false);
  const [cartItems,setCartItems] = useState([]as CartItemType[] );
  const {data,isLoading,error} = useQuery<CartItemType[]>('products' , getProducts);

  console.log(data);

  const getTotalItems = (items :CartItemType[]) => (
    items.reduce((ack : number , item) => ack + item.amount , 0 )
  ); 

  const handleAddToCart = (clickedItem : CartItemType) => {
    setCartItems(prev => {
      const isItemInCart = prev.find(item => item.id === clickedItem.id);
      if(isItemInCart) {
        return prev.map(item => (
          item.id === clickedItem.id
          ? { ...item , amount : item.amount +1 } : item
        ))
      }

      return [...prev,{...clickedItem , amount : 1}];
    })
  };

  const handleRemoveFromCart = (id : number) => {
    setCartItems(prev => 
      prev.reduce((ack , item) => {
        if(item.id === id){
          if(item.amount === 1 ) return ack ;
          return [...ack , {...item,amount : item.amount - 1}];
        }else{
          return [...ack,item];
        }
      } , [] as CartItemType[])
      ) ;
  }

  if(isLoading) return <LinearProgress/>
  if(error) return <div>Something went wrong</div>

  return (
    <Wrapper>
      <Drawer anchor = 'right' open = {cartOpen} onClose = {() => setCartOpen(false)}>
            <Cart cartItems = {cartItems} addToCart = {handleAddToCart}
            removeFromCart = {handleRemoveFromCart}/>
      </Drawer>
      <StyledButton onClick = {() => setCartOpen(true)}>
        <Badge badgeContent = {getTotalItems(cartItems)} color = 'error'>
          <AddShoppingCart />
        </Badge>
      </StyledButton>
      <Grid container spacing = {3}>
        {data?.map(item => (
          <Grid item key = {item.id} xs ={12} sm = {4}>
              <Item item = {item} handleAddToCart = {handleAddToCart} />
          </Grid>
        ))}
      </Grid>
    </Wrapper>
  );
}

export default App;
