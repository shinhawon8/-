class 상품틀{
       constructor(이미지,제품명,설명,가격,재고,수량){
        this.이미지 = 이미지;
        this.제품명 = 제품명;
        this.설명 = 설명;
        this.가격 = parseInt(가격);
         this.재고 = parseInt(재고);
         this.수량 = parseInt(수량);
    }
}


class 장바구니카트 {
constructor() {
   this.아이템들 = [];
    
   const 장바구니부모 = document.querySelector('.장바구니');
   장바구니부모.addEventListener('click',(event)=>{ //이벤트위임 복습하기
      const 플러스버튼 = event.target.closest('.플러스');
      if(플러스버튼){
      const 플러스버튼아이디 = 플러스버튼.dataset.id;
      const 찾은상품 = this.아이템들.find((상품) => {
         return 상품.제품명 === 플러스버튼아이디;
      })
      if(찾은상품){ //find()를 실행하면 배열의 참조값을 가져온다. 이것도 복습
         if(찾은상품.수량 < 찾은상품.재고){
            찾은상품.수량++;
         this.화면렌더();
      }else{
         alert('수량을 초과합니다.')
      }
         }
      }


      const 마이너스버튼 = event.target.closest('.마이너스');
      
      if(마이너스버튼){
         const 마이너스버튼아이디 = 마이너스버튼.dataset.id;
         const 찾은상품 = this.아이템들.find((상품) => { //find()에 매개변수가 왜필요한지 공부 아직 이해가안감
            return 상품.제품명 === 마이너스버튼아이디;
         })
    
      if(찾은상품){
             if(찾은상품.수량 > 1){
            찾은상품.수량--;
         this.화면렌더();
      }else{
         alert('최소 수량은 1개입니다.')
      }
      }
         
   }

   })
  
}



추가(담을상품){
   
   if(담을상품 === undefined){
      return;
   }
   this.아이템들.push(담을상품); //매개변수로 전달받아 배열에 넣어야지 밑에 메서드가 작동한다. 
   this.화면렌더();
   }

  화면렌더(){ //상태와 뷰를 분리하는거 복습하기
    const 장바구니부모 = document.querySelector('.장바구니')
    
     장바구니부모.innerHTML = ''; //이 문장도 왜필요한지 정확하게 이해안감 복습하기
    for(const 아이템 of this.아이템들){
      const 장바구니자식  = document.createElement('li');
      장바구니자식.innerHTML = `${아이템.제품명} ${아이템.가격}  <button class='플러스' data-id="${아이템.제품명}"> + </button> <span class='수량'>${아이템.수량}개</span> <button class='마이너스' data-id="${아이템.제품명}"> - </button>  <span class='총합계'>총합계: ${아이템.가격 * 아이템.수량}원</span>`
   장바구니부모.appendChild(장바구니자식);
    }
  }//data-id가 왜필요한지도 복습
}







class 상품목록{
 constructor(전달상품){
 this.제품 = [new 상품틀(
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjLHK-PSnVwSkxfpPp-lJ3oZLQFejgWYLgZ5AmjTICYw&s=10',
     '베개',
     '푹신한 베개',
     '30000',
     '5',
     '1'
 ), //매개변수를 전달시 인스턴스를 생성후 ''를 사용해 전달한다 객체를 만들필요가 없다 객체지향 프로그래밍이기때문에
    new 상품틀(
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRM7wYoXimQebQhz9kPx3dTHUUtv64RASKPAAnIka92KQ&s',
    '침대',
    '푹신한 침대',
    '50000',
    '5',
    '1'
 )]
 this.카트 = 전달상품;
};
   화면렌더() {
   
      const 상품리스트부모 = document.querySelector('.상품목록');
      상품리스트부모.innerHTML = '';
   for (const [index,제품들] of this.제품.entries()) { //this.제품을 써야지 클래스안 인스턴스를 가리킬수있다.
    const 상품리스트자식 = document.createElement('li')
    상품리스트자식.className = '상품리스트';
   
    상품리스트자식.innerHTML = `<img src = ${제품들.이미지} ></img> <div class='제품내용'> ${제품들.제품명} </br> ${제품들.설명} </br> ${제품들.가격} </br> 재고 ${제품들.재고}개 </div>
    <button class='장바구니추가' data-index="${index}" > 장바구니 </button>`

      
   상품리스트부모.appendChild(상품리스트자식);
   }
   }      
    장바구니전달(){
      
      const 상품리스트부모 = document.querySelector('.상품목록')
     상품리스트부모.addEventListener('click', (event) => {
      const 장바구니버튼 = event.target.closest('.장바구니추가');
      if(!장바구니버튼) return;

      const 인덱스 = Number(장바구니버튼.dataset.index);
      if(isNaN(인덱스)) return;
     
      if(this.제품[인덱스]){
         alert('장바구니에 담았습니다.')
          const 선택된상품 = this.제품[인덱스];
      this.카트.추가(선택된상품);
      }return 장바구니버튼.disabled = true;
     })
    }
}

const 카트 = new 장바구니카트();

const 상품목록들 = new 상품목록(카트);



상품목록들.화면렌더();
상품목록들.장바구니전달();

카트.추가();


