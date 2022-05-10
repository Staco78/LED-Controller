# Doc

### Packet structure:
```c
uint8_t magic;
uint8_t size;
uint8_t action;
uint8_t subAction;
uint8_t data[size - 4];
```

Magic is 0xAB  
Size is the total size of the packet

#
### Actions:
0. Set color

#
### SubActions:
#### For action 0 (set color):
0. Static color:  
Data looks like
```c
uint8_t r;
uint8_t g;
uint8_t b;
```