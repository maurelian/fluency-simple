max_uint_256: public(uint256)

@public
def __init__():
    self.max_uint_256 = 2*(2**255-1)+1

@public 
def lessThanMaxUint(a: uint256) -> (bool):
  return a < self.max_uint_256

@public 
def notEqualToMaxUint(a: uint256) -> (bool):
  return a != self.max_uint_256
  