# Vanilla JS OOP Shopping Cart

순수 자바스크립트(Vanilla JavaScript)의 클래스(Class) 기반 객체 지향 프로그래밍(OOP) 패러다임을 적용하여 구현한 장바구니 웹 애플리케이션입니다. 외부 라이브러리 없이 상태(State)와 뷰(View)를 분리하고, 의존성 주입(Dependency Injection)과 이벤트 위임(Event Delegation) 패턴을 사용하여 컴포넌트 간 결합도를 낮추고 렌더링 성능을 최적화했습니다.

---

## 1. 아키텍처 및 클래스 설계 (Class Architecture)

애플리케이션은 단일 책임 원칙(SRP)에 따라 3개의 핵심 클래스로 분리되어 동작합니다.

| 클래스명 | 역할 구분 | 주요 책임 및 메서드 |
| :--- | :--- | :--- |
| **`상품틀`** | Data Model | 상품의 속성(이미지, 제품명, 설명, 가격, 재고, 수량) 정의 및 정수(`Number`) 타입 형변환 |
| **`장바구니카트`** | State & Cart View | 장바구니 아이템 배열(`this.아이템들`) 상태 관리, `추가()`를 통한 아이템 삽입, 수량 증감 검증(재고 한도 및 최소 수량 1개), `화면렌더()`를 통한 장바구니 DOM 동기화 |
| **`상품목록`** | Product List View & Controller | 초기 상품 인스턴스 목록 생성, 생성자를 통한 `장바구니카트` 인스턴스 의존성 주입(`this.카트`), `화면렌더()`를 통한 상품 리스트 출력, `장바구니전달()`을 통한 선택 상품 전달 및 버튼 비활성화 |

---

## 2. 데이터 흐름 및 동작 프로세스 (Execution Flow)

1. **초기화 및 의존성 주입 (Initialization & DI)**
   - `const 카트 = new 장바구니카트()`를 통해 장바구니 인스턴스를 생성하고 `.장바구니` 영역에 이벤트 리스너를 바인딩합니다.
   - `const 상품목록들 = new 상품목록(카트)` 실행 시 생성자 매개변수로 `카트` 인스턴스의 메모리 참조를 주입하여 두 컴포넌트를 연결합니다.

2. **상품 렌더링 및 장바구니 추가 (Add to Cart)**
   - `상품목록들.화면렌더()`가 `this.제품.entries()`를 순회하며 각 상품의 인덱스를 `data-index` 속성에 바인딩하여 DOM에 렌더링합니다.
   - 사용자가 `장바구니` 버튼 클릭 시 `dataset.index`로 대상 인스턴스를 식별하고, `this.카트.추가(선택된상품)`를 호출하여 장바구니 상태를 업데이트한 뒤 해당 버튼을 비활성화(`disabled = true`)합니다.

3. **수량 조절 및 리렌더링 (State Mutation & Re-rendering)**
   - 장바구니 내부의 `+` / `-` 버튼 클릭 시 `dataset.id`를 기준으로 `this.아이템들.find()`를 수행하여 배열 내 원본 인스턴스의 참조를 획득합니다.
   - 재고 수량 및 최소 수량(1개) 유효성 검증을 통과하면 원본 인스턴스의 `수량` 프로퍼티를 증감시키고, `this.화면렌더()`를 호출하여 변경된 상태를 화면에 즉시 반영합니다.

---

## 3. 핵심 기술 포인트 (Core Technical Concepts)

* **생성자 의존성 주입 (Constructor Dependency Injection)**
  전역 변수나 별도의 정적(Static) 중계 클래스에 의존하지 않고, `상품목록` 인스턴스 생성 시점에 `장바구니카트` 인스턴스의 참조를 주입받아 컴포넌트 간 통신 경로를 명확히 구축했습니다.

* **이벤트 위임 (Event Delegation)**
  상태 변경 시마다 재생성되는 하위 `li` 및 `button` 노드에 개별 리스너를 등록하지 않고, 정적 부모 컨테이너(`.상품목록`, `.장바구니`)에 단일 이벤트 리스너를 등록한 뒤 `event.target.closest()`로 타겟을 판별하여 메모리 누수와 이벤트 소실 문제를 방지했습니다.

* **참조 기반 상태 변이 (Reference-based State Mutation)**
  `Array.prototype.find()`가 반환하는 객체의 힙(Heap) 메모리 참조 주소를 활용하여, 별도의 배열 재생성 없이 장바구니 내 특정 상품 인스턴스의 상태를 직접 갱신했습니다.

* **상태 기반 단방향 렌더링 (State-driven Rendering)**
  상태(`this.아이템들`)가 변경될 때마다 컨테이너의 기존 DOM을 초기화(`innerHTML = ''`)하고 최신 상태 배열을 기반으로 뷰를 재구성하여 데이터와 UI 간의 정합성을 유지했습니다.

---

## 4. 트러블슈팅 및 코드 개선 기록 (Troubleshooting)

* **이벤트 위임 시 Null 참조 에러(`TypeError`) 방지**
  - **문제:** `.장바구니` 영역 클릭 시 `event.target.closest('.마이너스')`의 반환값을 검증하기 전에 `dataset.id`에 접근할 경우, 플러스 버튼이나 빈 공간 클릭 시 `null` 참조 에러가 발생함.
  - **해결:** 반드시 `if (마이너스버튼)` 조건문 내부에서 `dataset.id`를 참조하도록 실행 순서를 교정함.

* **템플릿 리터럴 내 산술 연산 처리**
  - **문제:** 총합계 출력 시 가격과 수량 변수 간의 연산자 누락으로 인한 구문 오류 발생.
  - **해결:** `${아이템.가격 * 아이템.수량}`으로 곱셈 연산자를 명시하고, 생성자 단계에서 `parseInt()`를 적용하여 타입 안정성을 확보함.



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


