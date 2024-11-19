export enum SearchType {
  TITLE = 'title',
  AUTHOR = 'author',
  ISBN = 'isbn',
  PUBLISHER = 'publisher',
}

export enum BookStatusType {
  AVAILABLE = 'available',
  BORROWED = 'borrowed',
  RESERVED = 'reserved',
}

//컨트롤러에서 사용할때 어떤타입이 가능한지 지정해줄때 사용
